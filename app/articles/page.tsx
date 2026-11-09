import ListeArticles from "@/components/liste-articles";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = {
  title: "Articles | Odyssée Kréyol",
  description:
    "Découvrez des articles sur la culture et les richesses de la Guadeloupe.",
};

export default async function Articles() {
  const supabase = await createClient();
  const {data, error } = await supabase
  .schema("public")
  .from("articles")
  .select("title, slug, excerpt")
  .eq("status", "published");

  if(error) {
    console.error("Erreur de chargement des articles : ", error);
  }

  const articles = (data ?? []).map((article) => ({
    titre: article.title,
    slug: article.slug,
    description: article.excerpt ?? "",
  }));

  return (
    <main className="w-full">
      <section>
        <h1 className="text-center">Articles</h1>
        <p>Les articles qui font briller la Guadeloupe : </p>

        {error ? (
          <p role="alert" className="text-center">
            Impossible de charger les articles pour le moment.
          </p>
          ) : (
        <ListeArticles articles={articles} />
          )}


      </section>
    </main>
  );
}