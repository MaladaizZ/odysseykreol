import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { obtenirSession } from "@/src/lib/session";
import {
  creerClientAdministration,
  ErreurConfigurationAdministration,
} from "@/src/lib/supabase/admin";

export const metadata = {
  title: "Gestion des membres | Administration | Odyssée Kréyol",
  robots: { index: false },
};

type MembreAffiche = {
  id: string;
  email: string;
  role: "admin" | "membre";
  created_at: string;
};

type ParametresPage = {
  searchParams: Promise<{
    page?: string | string[];
    resultat?: string | string[];
  }>;
};

export default async function Membres({ searchParams }: ParametresPage) {
  const { utilisateur, administrateur } = await obtenirSession();
  if (!utilisateur) redirect("/connexion");
  if (!administrateur) notFound();

  const parametres = await searchParams;
  const pageDemandee = parametres.page;
  const page =
    typeof pageDemandee === "string" &&
    /^[1-9][0-9]{0,4}$/.test(pageDemandee) &&
    Number(pageDemandee) <= 10000
      ? Number(pageDemandee)
      : 1;
  const messageResultat =
    parametres.resultat === "modifie"
      ? "Le compte du membre a été modifié."
      : parametres.resultat === "supprime"
        ? "Le compte du membre a été supprimé. Ses articles ont été conservés sans être associés à ce compte."
        : "";

  let membres: MembreAffiche[] = [];
  let pageSuivante = false;
  let messageErreur = "";

  try {
    const administration = creerClientAdministration();
    const { data, error } = await administration.auth.admin.listUsers({
      page,
      perPage: 20,
    });

    if (error) {
      console.error("Erreur de chargement des membres :", error.code, error.status);
      messageErreur = "Impossible de charger les membres pour le moment.";
    } else {
      membres = data.users.map((membre): MembreAffiche => ({
        id: membre.id.toLowerCase(),
        email: membre.email ?? "",
        role: membre.app_metadata?.role === "admin" ? "admin" : "membre",
        created_at: membre.created_at,
      }));
      pageSuivante =
        page < 10000 &&
        (data.total > 0 ? page * 20 < data.total : membres.length === 20);
    }
  } catch (erreur) {
    if (erreur instanceof ErreurConfigurationAdministration) {
      messageErreur =
        "La clé d’administration Supabase doit être configurée côté serveur pour gérer les membres.";
    } else {
      console.error("Erreur de chargement des membres.");
      messageErreur = "Impossible de charger les membres pour le moment.";
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Gestion des membres</h1>

      {messageResultat && (
        <p role="status" className="mt-4">
          {messageResultat}
        </p>
      )}

      {messageErreur ? (
        <p role="alert" className="mt-6">{messageErreur}</p>
      ) : (
        <>
          {membres.length === 0 ? (
            <p className="mt-6">Aucun membre sur cette page.</p>
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {membres.map((membre) => (
                <li key={membre.id} className="rounded-lg bg-(--odyssey-turquoise) p-4">
                  <h2 className="break-words font-semibold">
                    {membre.email || "Sans adresse e-mail"}
                  </h2>
                  <p className="mt-2 text-sm">
                    {membre.role === "admin" ? "Administrateur" : "Membre"}
                  </p>
                  <p className="mt-2 text-sm">
                    Inscription :{" "}
                    <time dateTime={membre.created_at}>
                      {new Date(membre.created_at).toLocaleDateString("fr-FR", {
                        timeZone: "Europe/Paris",
                      })}
                    </time>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <Link href={`/admin/membres/${membre.id}/modifier`} className="underline">
                      Modifier
                    </Link>
                    {membre.id !== utilisateur.id.toLowerCase() && (
                      <Link href={`/admin/membres/${membre.id}/supprimer`} className="underline">
                        Supprimer
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <nav aria-label="Pagination des membres" className="mt-6 flex flex-wrap items-center gap-4">
            {page > 1 && (
              <Link href={`/admin/membres?page=${page - 1}`} className="underline">
                Page précédente
              </Link>
            )}
            <span>Page {page}</span>
            {pageSuivante && (
              <Link href={`/admin/membres?page=${page + 1}`} className="underline">
                Page suivante
              </Link>
            )}
          </nav>
        </>
      )}

      <Link href="/admin" className="mt-6 inline-block underline">
        Retour à l’administration
      </Link>
    </main>
  );
}
