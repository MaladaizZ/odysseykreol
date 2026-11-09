import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ConfirmationSuppressionArticle from "@/components/confirmation-suppression-article";
import { estIdentifiantArticle } from "@/src/lib/articles";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = {
  title: "Supprimer un article | Odyssée Kréyol",
  robots: { index: false },
};

export default async function SupprimerArticle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: session, error: erreurSession } = await supabase.auth.getUser();

  if (erreurSession || !session.user) {
    redirect("/connexion");
  }

  const { id } = await params;
  if (!estIdentifiantArticle(id)) {
    notFound();
  }

  const { data: article, error } = await supabase
    .schema("public")
    .from("articles")
    .select("id, title")
    .eq("id", id)
    .eq("author_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Erreur de chargement de l’article à supprimer :", error);
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Supprimer un article</h1>
        <p role="alert" className="mt-4">
          Impossible de charger cet article pour le moment.
        </p>
        <Link href="/mes-articles" className="inline-block mt-6 underline">
          Retour à mes articles
        </Link>
      </main>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Supprimer un article</h1>
      <p className="mt-4">
        Article : <strong>{article.title}</strong>
      </p>
      <p className="mt-4">Cette suppression est définitive.</p>

      <ConfirmationSuppressionArticle key={id} articleId={id} />

      <Link href="/mes-articles" className="inline-block mt-6 underline">
        Annuler et revenir à mes articles
      </Link>
    </main>
  );
}
