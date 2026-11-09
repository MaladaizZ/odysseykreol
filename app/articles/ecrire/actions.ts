"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import {
  creerBaseSlug,
  lireValeursArticle,
  texteVersDocument,
  validerArticle,
  type EtatFormulaireArticle,
} from "@/src/lib/articles";

export async function publierArticle(
  _etatPrecedent: EtatFormulaireArticle,
  formulaire: FormData,
): Promise<EtatFormulaireArticle> {
  const valeurs = lireValeursArticle(formulaire);
  const erreurValidation = validerArticle(valeurs);
  if (erreurValidation) {
    return { message: erreurValidation, valeurs };
  }

  const titre = valeurs.titre.trim();
  const resume = valeurs.resume.trim();
  const contenu = valeurs.contenu.trim();
  let slug = "";

  try {
    const supabase = await createClient();
    const { data, error: erreurSession } = await supabase.auth.getUser();

    if (erreurSession || !data.user) {
      return {
        message: "Ta connexion n’a pas pu être vérifiée. Reconnecte-toi avant de publier.",
        valeurs,
      };
    }

    // Le suffixe permet de publier plusieurs articles portant le même titre.
    slug = creerBaseSlug(titre) + "-" + randomUUID();

    const { error } = await supabase
      .schema("public")
      .from("articles")
      .insert({
        author_id: data.user.id,
        title: titre,
        slug,
        excerpt: resume,
        content: texteVersDocument(contenu),
        status: "published",
        published_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Erreur de publication de l’article :", error);
      return {
        message: "L’article n’a pas été enregistré. Réessaie dans quelques instants.",
        valeurs,
      };
    }
  } catch (erreur) {
    console.error("Erreur de publication de l’article :", erreur);
    return {
      message: "Impossible de contacter le service de publication. Réessaie plus tard.",
      valeurs,
    };
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/mes-articles");
  revalidatePath("/admin");
  redirect("/articles/" + slug);
}
