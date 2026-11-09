import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ConfirmationSuppressionMembre from "@/components/confirmation-suppression-membre";
import { estIdentifiantMembre } from "@/src/lib/membres";
import { obtenirSession } from "@/src/lib/session";
import {
  creerClientAdministration,
  ErreurConfigurationAdministration,
} from "@/src/lib/supabase/admin";

export const metadata = {
  title: "Supprimer un membre | Administration | Odyssée Kréyol",
  robots: { index: false },
};

export default async function SupprimerMembre({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { utilisateur, administrateur } = await obtenirSession();
  if (!utilisateur) redirect("/connexion");
  if (!administrateur) notFound();

  const { id: identifiant } = await params;
  if (!estIdentifiantMembre(identifiant)) {
    notFound();
  }
  const id = identifiant.toLowerCase();

  if (id === utilisateur.id.toLowerCase()) {
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Supprimer un membre</h1>
        <p role="status" className="mt-4">
          Tu ne peux pas supprimer ton propre compte depuis l’administration.
        </p>
        <Link href="/admin/membres" className="mt-6 inline-block underline">
          Retour aux membres
        </Link>
      </main>
    );
  }

  let membre: { id: string; email: string } | null = null;
  let nombreArticles: number | null = null;
  let introuvable = false;
  let messageErreur = "";

  try {
    const administration = creerClientAdministration();
    const { data, error } = await administration.auth.admin.getUserById(id);

    if (error) {
      if (error.status === 404 || error.code === "user_not_found") {
        introuvable = true;
      } else {
        console.error("Erreur de chargement du membre à supprimer :", error.code, error.status);
        messageErreur = "Impossible de charger ce membre pour le moment.";
      }
    } else if (!data.user) {
      introuvable = true;
    } else {
      membre = { id: data.user.id, email: data.user.email ?? "" };

      const { count, error: erreurArticles } = await administration
        .schema("public")
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("author_id", id);

      if (erreurArticles || count === null) {
        console.error("Erreur de comptage des articles du membre :", erreurArticles?.code);
        messageErreur = "Impossible de vérifier les articles de ce membre pour le moment.";
      } else {
        nombreArticles = count;
      }
    }
  } catch (erreur) {
    if (erreur instanceof ErreurConfigurationAdministration) {
      messageErreur =
        "La clé d’administration Supabase doit être configurée côté serveur pour gérer les membres.";
    } else {
      console.error("Erreur de chargement du membre à supprimer.");
      messageErreur = "Impossible de charger ce membre pour le moment.";
    }
  }

  if (introuvable) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Supprimer un membre</h1>

      {messageErreur ? (
        <p role="alert" className="mt-4">{messageErreur}</p>
      ) : membre && nombreArticles !== null ? (
        <>
          <p className="mt-4">
            Compte : <strong>{membre.email || "Sans adresse e-mail"}</strong>
          </p>
          <p className="mt-4">Articles associés : {nombreArticles}.</p>
          <p className="mt-4">
            La suppression du compte est définitive. Les articles seront conservés
            et ne seront plus attribués à un membre.
          </p>

          <ConfirmationSuppressionMembre key={membre.id} membreId={membre.id} />
        </>
      ) : null}

      <Link href="/admin/membres" className="mt-6 inline-block underline">
        Annuler et revenir aux membres
      </Link>
    </main>
  );
}
