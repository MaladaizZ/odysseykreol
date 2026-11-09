import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FormulaireMembre from "@/components/formulaire-membre";
import { estIdentifiantMembre } from "@/src/lib/membres";
import { obtenirSession } from "@/src/lib/session";
import {
  creerClientAdministration,
  ErreurConfigurationAdministration,
} from "@/src/lib/supabase/admin";

export const metadata = {
  title: "Modifier un membre | Administration | Odyssée Kréyol",
  robots: { index: false },
};

export default async function ModifierMembre({
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

  let membre: { id: string; email: string } | null = null;
  let introuvable = false;
  let messageErreur = "";

  try {
    const administration = creerClientAdministration();
    const { data, error } = await administration.auth.admin.getUserById(id);

    if (error) {
      if (error.status === 404 || error.code === "user_not_found") {
        introuvable = true;
      } else {
        console.error("Erreur de chargement du membre à modifier :", error.code, error.status);
        messageErreur = "Impossible de charger ce membre pour le moment.";
      }
    } else if (!data.user) {
      introuvable = true;
    } else {
      membre = { id: data.user.id, email: data.user.email ?? "" };
    }
  } catch (erreur) {
    if (erreur instanceof ErreurConfigurationAdministration) {
      messageErreur =
        "La clé d’administration Supabase doit être configurée côté serveur pour gérer les membres.";
    } else {
      console.error("Erreur de chargement du membre à modifier.");
      messageErreur = "Impossible de charger ce membre pour le moment.";
    }
  }

  if (introuvable) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Modifier un membre</h1>

      {messageErreur ? (
        <p role="alert" className="mt-4">{messageErreur}</p>
      ) : membre ? (
        <FormulaireMembre
          key={membre.id}
          membreId={membre.id}
          emailInitial={membre.email}
        />
      ) : null}

      <Link href="/admin/membres" className="mt-6 inline-block underline">
        Retour aux membres
      </Link>
    </main>
  );
}
