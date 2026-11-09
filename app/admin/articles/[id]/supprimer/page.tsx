import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { supprimerArticleAdministrateur } from "@/app/admin/articles/actions";
import ConfirmationSuppressionArticle from "@/components/confirmation-suppression-article";
import { estIdentifiantArticle } from "@/src/lib/articles";
import { obtenirSession } from "@/src/lib/session";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = {
  title: "Supprimer un article | Administration | Odyssée Kréyol",
  robots: { index: false },
};

export default async function SupprimerArticleAdministrateur({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { utilisateur, administrateur } = await obtenirSession();

  if (!utilisateur) {
    redirect("/connexion");
  }
  if (!administrateur) {
    notFound();
  }

  const { id } = await params;
  if (!estIdentifiantArticle(id)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: article, error } = await supabase
    .schema("public")
    .from("articles")
    .select("id, title")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Erreur de chargement de l’article à supprimer dans l’administration :", error);
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Supprimer un article</h1>
        <p role="alert" className="mt-4">
          Impossible de charger cet article pour le moment.
        </p>
        <Link href="/admin" className="inline-block mt-6 underline">
          Retour à l’administration
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

      <ConfirmationSuppressionArticle
        key={id}
        articleId={id}
        action={supprimerArticleAdministrateur.bind(null, id)}
      />

      <Link href="/admin" className="inline-block mt-6 underline">
        Annuler et revenir à l’administration
      </Link>
    </main>
  );
}
