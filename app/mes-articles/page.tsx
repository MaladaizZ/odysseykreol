import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = {
  title: "Mes articles | Odyssée Kréyol",
  description: "Retrouve et gère tes articles.",
  robots: { index: false },
};

type ParametresPage = {
  searchParams: Promise<{ resultat?: string | string[] }>;
};

export default async function MesArticles({ searchParams }: ParametresPage) {
  const supabase = await createClient();
  const { data: session, error: erreurSession } = await supabase.auth.getUser();

  if (erreurSession || !session.user) {
    redirect("/connexion");
  }

  const { data, error } = await supabase
    .schema("public")
    .from("articles")
    .select("id, title, slug, excerpt, status")
    .eq("author_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur de chargement des articles du membre :", error);
  }

  const parametres = await searchParams;
  const resultat = parametres.resultat;
  const message =
    resultat === "modifie"
      ? "Ton article a été modifié."
      : resultat === "supprime"
        ? "Ton article a été supprimé."
        : "";
  const articles = data ?? [];

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Mes articles</h1>

        <Link
          href="/articles/ecrire"
          className="rounded-lg bg-(--odyssey-ocean) p-2 text-center text-(--odyssey-sand)"
        >
          Écrire un article
        </Link>
      </div>

      {message && (
        <p role="status" className="mt-4">
          {message}
        </p>
      )}

      {error ? (
        <p role="alert" className="mt-6">
          Impossible de charger tes articles pour le moment.
        </p>
      ) : articles.length === 0 ? (
        <p className="mt-6">Tu n’as pas encore écrit d’article.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <li key={article.id}>
              <article className="flex h-full flex-col rounded-lg bg-(--odyssey-turquoise) p-4">
                <h2 className="break-words font-semibold">{article.title}</h2>
                <p className="mt-2 text-sm">
                  {article.status === "published" ? "Publié" : "Brouillon"}
                </p>
                <p className="mt-2 break-words">{article.excerpt}</p>

                <div className="mt-4 flex flex-wrap gap-4">
                  {article.status === "published" && (
                    <Link href={`/articles/${article.slug}`} className="underline">
                      Lire
                    </Link>
                  )}

                  <Link
                    href={`/mes-articles/${article.id}/modifier`}
                    className="underline"
                  >
                    Modifier
                  </Link>

                  <Link
                    href={`/mes-articles/${article.id}/supprimer`}
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
