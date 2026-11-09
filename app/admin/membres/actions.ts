"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { obtenirSession } from "@/src/lib/session";
import {
  creerClientAdministration,
  ErreurConfigurationAdministration,
} from "@/src/lib/supabase/admin";
import {
  estEmailValide,
  estIdentifiantMembre,
  estNouveauMotDePasseValide,
} from "@/src/lib/membres";

// Le mot de passe ne fait jamais partie de l'état renvoyé au navigateur.
export type EtatModificationMembre = { message: string; email: string };
export type EtatSuppressionMembre = { message: string };

export async function modifierMembre(
  membreId: string,
  _etatPrecedent: EtatModificationMembre,
  formulaire: FormData,
): Promise<EtatModificationMembre> {
  const champEmail = formulaire.get("email");
  const email = typeof champEmail === "string" ? champEmail.trim() : "";
  const { utilisateur, administrateur } = await obtenirSession();

  if (!utilisateur || !administrateur) {
    return { message: "L’accès administrateur est requis pour cette opération.", email };
  }
  if (!estIdentifiantMembre(membreId)) {
    return { message: "Ce compte est introuvable.", email };
  }
  if (!estEmailValide(email)) {
    return { message: "Renseigne une adresse e-mail valide.", email };
  }

  const champMotDePasse = formulaire.get("motDePasse");
  if (champMotDePasse !== null && typeof champMotDePasse !== "string") {
    return { message: "Le nouveau mot de passe doit être du texte.", email };
  }
  const motDePasse = champMotDePasse ?? "";
  if (motDePasse !== "" && !estNouveauMotDePasseValide(motDePasse)) {
    return {
      message: "Le nouveau mot de passe doit contenir entre 12 et 128 caractères et ne peut pas être composé uniquement d’espaces.",
      email,
    };
  }

  const id = membreId.toLowerCase();
  try {
    const client = creerClientAdministration();
    const { data: cible, error: erreurLecture } = await client.auth.admin.getUserById(id);
    if (erreurLecture || !cible.user) {
      return { message: "Impossible de retrouver ce compte. Actualise la liste.", email };
    }

    const changements: { email?: string; password?: string } = {};
    if (email.toLowerCase() !== (cible.user.email ?? "").toLowerCase()) {
      changements.email = email;
    }
    if (motDePasse !== "") changements.password = motDePasse;

    if (Object.keys(changements).length === 0) {
      return { message: "Aucune modification n’a été demandée.", email };
    }

    const { error } = await client.auth.admin.updateUserById(cible.user.id, changements);
    if (error) {
      if (error.code === "email_exists" || error.code === "user_already_exists") {
        return { message: "Cette adresse e-mail est déjà utilisée.", email };
      }
      if (error.code === "weak_password") {
        return {
          message: "Ce mot de passe ne respecte pas les règles de sécurité du projet. Choisis-en un plus robuste.",
          email,
        };
      }
      return { message: "Les informations du compte n’ont pas pu être modifiées.", email };
    }
  } catch (erreur) {
    if (erreur instanceof ErreurConfigurationAdministration) {
      return { message: erreur.message, email };
    }
    // Ne pas journaliser l'erreur brute : une requête Auth peut contenir un secret.
    console.error("Erreur pendant la modification administrative d’un compte.");
    return { message: "Impossible de modifier ce compte pour le moment.", email };
  }

  revalidatePath("/admin/membres");
  revalidatePath("/admin/membres/" + id + "/modifier");
  revalidatePath("/admin/membres/" + id + "/supprimer");
  redirect("/admin/membres?resultat=modifie");
}

export async function supprimerMembre(
  membreId: string,
  _etatPrecedent: EtatSuppressionMembre,
  formulaire: FormData,
): Promise<EtatSuppressionMembre> {
  const { utilisateur, administrateur } = await obtenirSession();
  if (!utilisateur || !administrateur) {
    return { message: "L’accès administrateur est requis pour cette opération." };
  }
  if (!estIdentifiantMembre(membreId)) {
    return { message: "Ce compte est introuvable." };
  }

  const id = membreId.toLowerCase();
  if (id === utilisateur.id.toLowerCase()) {
    return { message: "Tu ne peux pas supprimer ton propre compte depuis cet espace." };
  }
  if (formulaire.get("confirmation") !== "oui") {
    return { message: "Coche la confirmation avant de supprimer définitivement ce compte." };
  }

  try {
    const client = creerClientAdministration();
    const { data: cible, error: erreurLecture } = await client.auth.admin.getUserById(id);
    if (erreurLecture || !cible.user) {
      return { message: "Impossible de retrouver ce compte. Actualise la liste." };
    }
    if (cible.user.id.toLowerCase() === utilisateur.id.toLowerCase()) {
      return { message: "Tu ne peux pas supprimer ton propre compte depuis cet espace." };
    }

    // Suppression Auth définitive. La FK SET NULL détache les articles dans la
    // transaction de suppression : aucune dissociation ou suppression manuelle ici.
    const { error } = await client.auth.admin.deleteUser(cible.user.id, false);
    if (error) {
      return {
        message: "La suppression a échoué. Le compte peut encore posséder des fichiers ou des données liées. Actualise la liste avant de réessayer.",
      };
    }
  } catch (erreur) {
    if (erreur instanceof ErreurConfigurationAdministration) {
      return { message: erreur.message };
    }
    console.error("Erreur pendant la suppression administrative d’un compte.");
    return {
      message: "Impossible de confirmer la suppression du compte. Actualise la liste avant de réessayer.",
    };
  }

  revalidatePath("/admin/membres");
  revalidatePath("/admin/membres/" + id + "/modifier");
  revalidatePath("/admin/membres/" + id + "/supprimer");
  revalidatePath("/admin");
  revalidatePath("/articles");
  revalidatePath("/articles/[slug]", "page");
  revalidatePath("/mes-articles");
  redirect("/admin/membres?resultat=supprime");
}
