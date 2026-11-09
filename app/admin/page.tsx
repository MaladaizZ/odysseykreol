import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { obtenirSession } from "@/src/lib/session";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = {
  title: "Administration | Odyssée Kréyol",
  robots: { index: false },
};

type ParametresPage = {
  searchParams: Promise<{ resultat?: string | string[] }>;
};

export default async function Administration({ searchParams }: ParametresPage) {
  const { utilisateur, administrateur } = await obtenirSession();

  if (!utilisateur) {
    redirect("/connexion");
  }

  if (!administrateur) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .schema("public")
    .from("articles")
    .select("id, title, slug, excerpt")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur de chargement des articles pour l’administration :", error);
  }

  const parametres = await searchParams;
  const resultat = parametres.resultat;
  const message =
    resultat === "modifie"
      ? "L’article a été modifié."
      : resultat === "supprime"
        ? "L’article a été supprimé."
        : "";
  const articles = data ?? [];

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Espace administration</h1>
      <Link href="/admin/membres" className="mt-4 inline-block underline">
        Gestion des membres
      </Link>
      <p className="mt-4">Gérer les articles publiés.</p>

      {message && (
        <p role="status" className="mt-4">
          {message}
        </p>
      )}

      {error ? (
        <p role="alert" className="mt-6">
          Impossible de charger les articles pour le moment.
        </p>
      ) : articles.length === 0 ? (
        <p className="mt-6">Aucun article publié pour le moment.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <li key={article.id}>
              <article className="flex h-full flex-col rounded-lg bg-(--odyssey-turquoise) p-4">
                <h2 className="break-words font-semibold">{article.title}</h2>
                <p className="mt-2 break-words">{article.excerpt}</p>

                <div className="mt-4 flex flex-wrap gap-4">
                  <Link href={`/articles/${article.slug}`} className="underline">
                    Lire
                  </Link>

                  <Link
                    href={`/admin/articles/${article.id}/modifier`}
                    className="underline"
                  >
                    Modifier
                  </Link>

                  <Link
                    href={`/admin/articles/${article.id}/supprimer`}
                    className="underline"
                  >
                    Supprimer
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
