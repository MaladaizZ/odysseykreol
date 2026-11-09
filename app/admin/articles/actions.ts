"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { obtenirSession } from "@/src/lib/session";
import { createClient } from "@/src/lib/supabase/server";
import {
  estIdentifiantArticle,
  lireValeursArticle,
  texteVersDocument,
  validerArticle,
  type EtatFormulaireArticle,
} from "@/src/lib/articles";
import type { EtatSuppression } from "@/app/mes-articles/actions";

function actualiserPagesArticle(articleId: string, slug: string) {
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath("/articles/" + slug);
  revalidatePath("/mes-articles");
  revalidatePath("/mes-articles/" + articleId + "/modifier");
  revalidatePath("/mes-articles/" + articleId + "/supprimer");
  revalidatePath("/admin");
  revalidatePath("/admin/articles/" + articleId + "/modifier");
  revalidatePath("/admin/articles/" + articleId + "/supprimer");
}

export async function modifierArticleAdministrateur(
  articleId: string,
  _etatPrecedent: EtatFormulaireArticle,
  formulaire: FormData,
): Promise<EtatFormulaireArticle> {
  const valeurs = lireValeursArticle(formulaire);
  const { utilisateur, administrateur } = await obtenirSession();

  if (!utilisateur || !administrateur) {
    return { message: "L’accès administrateur est requis pour cette opération.", valeurs };
  }
  if (!estIdentifiantArticle(articleId)) {
    return { message: "Cet article est introuvable.", valeurs };
  }
  const erreurValidation = validerArticle(valeurs);
  if (erreurValidation) return { message: erreurValidation, valeurs };

  let slug = "";
  try {
    const supabase = await createClient();
    const { data: article, error } = await supabase
      .schema("public")
      .from("articles")
      .update({
        title: valeurs.titre.trim(),
        excerpt: valeurs.resume.trim(),
        content: texteVersDocument(valeurs.contenu),
      })
      .eq("id", articleId)
      .eq("status", "published")
      .select("id, slug")
      .maybeSingle();

    if (error) {
      console.error("Erreur de modification administrative de l’article :", error);
      return {
        message: "Les modifications n’ont pas été enregistrées. Réessaie plus tard.",
        valeurs,
      };
    }
    if (!article) {
      return {
        message: "Cet article publié est introuvable ou n’est plus accessible.",
        valeurs,
      };
    }
    slug = article.slug;
  } catch (erreur) {
    console.error("Erreur de modification administrative de l’article :", erreur);
    return { message: "Impossible d’enregistrer les modifications pour le moment.", valeurs };
  }

  actualiserPagesArticle(articleId, slug);
  redirect("/admin?resultat=modifie");
}

export async function supprimerArticleAdministrateur(
  articleId: string,
  _etatPrecedent: EtatSuppression,
  formulaire: FormData,
): Promise<EtatSuppression> {
  const { utilisateur, administrateur } = await obtenirSession();

  if (!utilisateur || !administrateur) {
    return { message: "L’accès administrateur est requis pour cette opération." };
  }
  if (!estIdentifiantArticle(articleId)) {
    return { message: "Cet article est introuvable." };
  }
  if (formulaire.get("confirmation") !== "oui") {
    return { message: "Coche la confirmation avant de supprimer cet article." };
  }

  let slug = "";
  try {
    const supabase = await createClient();
    const { data: article, error } = await supabase
      .schema("public")
      .from("articles")
      .delete()
      .eq("id", articleId)
      .eq("status", "published")
      .select("id, slug")
      .maybeSingle();

    if (error) {
      console.error("Erreur de suppression administrative de l’article :", error);
      return { message: "L’article n’a pas été supprimé. Réessaie plus tard." };
    }
    if (!article) {
      return { message: "Cet article publié est introuvable ou n’est plus accessible." };
    }
    slug = article.slug;
  } catch (erreur) {
    console.error("Erreur de suppression administrative de l’article :", erreur);
    return { message: "Impossible de supprimer cet article pour le moment." };
  }

  actualiserPagesArticle(articleId, slug);
  redirect("/admin?resultat=supprime");
}
