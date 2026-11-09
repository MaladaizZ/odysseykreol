import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { modifierArticle } from "@/app/mes-articles/actions";
import FormulaireArticle from "@/components/formulaire-article";
import { estIdentifiantArticle, textePourEdition } from "@/src/lib/articles";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = {
  title: "Modifier un article | Odyssée Kréyol",
  robots: { index: false },
};

export default async function ModifierArticle({
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
    .select("id, title, excerpt, content")
    .eq("id", id)
    .eq("author_id", session.user.id)
    .maybeSingle();

  if (error) {
    console.error("Erreur de chargement de l’article à modifier :", error);
    return (
      <main className="mx-auto w-full max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Modifier un article</h1>
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

  const texte = textePourEdition(article.content);
  const actionModification = modifierArticle.bind(null, id);

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Modifier un article</h1>

      {texte === null ? (
        <p role="status" className="mt-4">
          Le format du contenu de cet article n’est pas encore pris en charge pour
          la modification.
        </p>
      ) : (
        <FormulaireArticle
          key={id}
          action={actionModification}
          valeursInitiales={{
            titre: article.title,
            resume: article.excerpt,
            contenu: texte,
          }}
          libelleBouton="Enregistrer les modifications"
          libelleEnCours="Enregistrement…"
        />
      )}

      <Link href="/mes-articles" className="inline-block mt-6 underline">
        Retour à mes articles
      </Link>
    </main>
  );
}
