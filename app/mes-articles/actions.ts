"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import {
  estIdentifiantArticle,
  lireValeursArticle,
  texteVersDocument,
  validerArticle,
  type EtatFormulaireArticle,
} from "@/src/lib/articles";

export type EtatSuppression = { message: string };

export async function modifierArticle(
  articleId: string,
  _etatPrecedent: EtatFormulaireArticle,
  formulaire: FormData,
): Promise<EtatFormulaireArticle> {
  const valeurs = lireValeursArticle(formulaire);
  if (!estIdentifiantArticle(articleId)) {
    return { message: "Cet article est introuvable.", valeurs };
  }
  const erreurValidation = validerArticle(valeurs);
  if (erreurValidation) return { message: erreurValidation, valeurs };

  let slug = "";
  try {
    const supabase = await createClient();
    const { data, error: erreurSession } = await supabase.auth.getUser();
    if (erreurSession || !data.user) {
      return { message: "Reconnecte-toi avant de modifier un article.", valeurs };
    }

    const { data: article, error } = await supabase
      .schema("public")
      .from("articles")
      .update({
        title: valeurs.titre.trim(),
        excerpt: valeurs.resume.trim(),
        content: texteVersDocument(valeurs.contenu),
      })
      .eq("id", articleId)
      .eq("author_id", data.user.id)
      .select("id, slug")
      .maybeSingle();

    if (error) {
      console.error("Erreur de modification de l’article :", error);
      return {
        message: "Les modifications n’ont pas été enregistrées. Réessaie plus tard.",
        valeurs,
      };
    }
    if (!article) {
      return {
        message: "Cet article est introuvable ou tu ne peux pas le modifier.",
        valeurs,
      };
    }
    slug = article.slug;
  } catch (erreur) {
    console.error("Erreur de modification de l’article :", erreur);
    return { message: "Impossible d’enregistrer les modifications pour le moment.", valeurs };
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/articles/" + slug);
  revalidatePath("/mes-articles");
  revalidatePath("/mes-articles/" + articleId + "/modifier");
  revalidatePath("/mes-articles/" + articleId + "/supprimer");
  revalidatePath("/admin");
  revalidatePath("/admin/articles/" + articleId + "/modifier");
  revalidatePath("/admin/articles/" + articleId + "/supprimer");
  redirect("/mes-articles?resultat=modifie");
}

export async function supprimerArticle(
  articleId: string,
  _etatPrecedent: EtatSuppression,
  formulaire: FormData,
): Promise<EtatSuppression> {
  if (!estIdentifiantArticle(articleId)) {
    return { message: "Cet article est introuvable." };
  }
  if (formulaire.get("confirmation") !== "oui") {
    return { message: "Coche la confirmation avant de supprimer cet article." };
  }

  let slug = "";
  try {
    const supabase = await createClient();
    const { data, error: erreurSession } = await supabase.auth.getUser();
    if (erreurSession || !data.user) {
      return { message: "Reconnecte-toi avant de supprimer un article." };
    }

    const { data: article, error } = await supabase
      .schema("public")
      .from("articles")
      .delete()
      .eq("id", articleId)
      .eq("author_id", data.user.id)
      .select("id, slug")
      .maybeSingle();

    if (error) {
      console.error("Erreur de suppression de l’article :", error);
      return { message: "L’article n’a pas été supprimé. Réessaie plus tard." };
    }
    if (!article) {
      return { message: "Cet article est introuvable ou tu ne peux pas le supprimer." };
    }
    slug = article.slug;
  } catch (erreur) {
    console.error("Erreur de suppression de l’article :", erreur);
    return { message: "Impossible de supprimer cet article pour le moment." };
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/articles/" + slug);
  revalidatePath("/mes-articles");
  revalidatePath("/mes-articles/" + articleId + "/modifier");
  revalidatePath("/mes-articles/" + articleId + "/supprimer");
  revalidatePath("/admin");
  revalidatePath("/admin/articles/" + articleId + "/modifier");
  revalidatePath("/admin/articles/" + articleId + "/supprimer");
  redirect("/mes-articles?resultat=supprime");
}
