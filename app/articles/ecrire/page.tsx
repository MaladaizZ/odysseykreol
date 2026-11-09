import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import FormulaireArticle from "./formulaire-article";

export const metadata = {
  title: "Écrire un article | Odyssée Kréyol",
  description: "Partagez votre regard sur la Guadeloupe.",
  robots: { index: false },
};

export default async function EcrireArticle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/connexion");
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">Écrire un article</h1>
      <p className="mt-4">
        Ton article sera public dès sa publication.
      </p>

      <FormulaireArticle />

      <Link href="/articles" className="inline-block mt-6 underline">
        Retour aux articles
      </Link>
    </main>
  );
}
