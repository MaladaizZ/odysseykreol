import { notFound } from "next/navigation";
import {articles} from "@/data/articles";
import Link from "next/link";


//methode qui recupere les metadatas des articles:
function trouverArticle(slug: string) {
  return articles.find((element) => element.slug === slug);
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

 const article = trouverArticle(slug);

  if (!article) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: `${article.titre} | Odyssée Kréyol`,
    description: article.description,
  };
}


export default async function Article({params,}: {params: Promise<{slug: string}>; }) {
    const {slug} = await params ;

        const article = trouverArticle(slug);

      if (!article) {
       notFound();
}
    return (
        <main>
            <article>
      <h1>{article.titre}</h1>
      <p>{article.contenu}</p>
      <Link href="/articles" className="inline-block mt-4 underline">
            Retour aux articles
      </Link>                
            </article>

        </main>
    );
}