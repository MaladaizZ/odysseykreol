import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { lireParagraphes } from "@/src/lib/articles";
import { createClient } from "@/src/lib/supabase/server";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const trouverArticle = cache(async (slug: string) => {
  const supabase = await createClient();
  const resultat = await supabase
    .schema("public")
    .from("articles")
    .select("title, slug, excerpt, content")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (resultat.error) {
    console.error("Erreur de chargement de l'article :", resultat.error);
  }

  return resultat;
});

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: article, error } = await trouverArticle(slug);

  if (error) {
    return {
      title: "Article indisponible | Odyssée Kréyol",
      description: "Cet article est momentanément indisponible.",
      robots: { index: false },
    };
  }

  if (!article) {
    notFound();
  }

  return {
    title: `${article.title} | Odyssée Kréyol`,
    description: article.excerpt,
  };
}

export default async function Article({ params }: ArticlePageProps) {
  const { slug } = await params;
  const { data: article, error } = await trouverArticle(slug);

  if (error) {
    return (
      <main>
        <article>
          <h1>Article indisponible</h1>
          <p role="alert">
            Impossible de charger cet article pour le moment.
          </p>
          <Link href="/articles" className="inline-block mt-4 underline">
            Retour aux articles
          </Link>
        </article>
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  const paragraphes = lireParagraphes(article.content);

  return (
    <main>
      <article>
        <h1>{article.title}</h1>

        {paragraphes === null ? (
          <p>Le contenu de cet article ne peut pas encore être affiché.</p>
        ) : paragraphes.some((paragraphe) => paragraphe.trim().length > 0) ? (
          paragraphes.map((paragraphe, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraphe}
            </p>
          ))
        ) : (
          <p>Cet article ne contient pas encore de texte.</p>
        )}

        <Link href="/articles" className="inline-block mt-4 underline">
          Retour aux articles
        </Link>
      </article>
    </main>
  );
}
