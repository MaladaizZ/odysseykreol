export const LIMITES_ARTICLE = {
  titre: 160,
  resume: 500,
  contenu: 20000,
};

export type ValeursArticle = { titre: string; resume: string; contenu: string };

export type EtatFormulaireArticle = {
  message: string;
  valeurs: ValeursArticle;
};

export function lireValeursArticle(formulaire: FormData): ValeursArticle {
  function lire(nom: string) {
    const valeur = formulaire.get(nom);
    return typeof valeur === "string" ? valeur : "";
  }
  return { titre: lire("titre"), resume: lire("resume"), contenu: lire("contenu") };
}

export function validerArticle(valeurs: ValeursArticle): string | null {
  const titre = valeurs.titre.trim();
  const resume = valeurs.resume.trim();
  const contenu = valeurs.contenu.trim();
  if (!titre || !resume || !contenu) {
    return "Le titre, le résumé et le contenu sont obligatoires.";
  }
  if (titre.length > LIMITES_ARTICLE.titre) {
    return "Le titre ne doit pas dépasser 160 caractères.";
  }
  if (resume.length > LIMITES_ARTICLE.resume) {
    return "Le résumé ne doit pas dépasser 500 caractères.";
  }
  if (contenu.length > LIMITES_ARTICLE.contenu) {
    return "Le contenu ne doit pas dépasser 20 000 caractères.";
  }
  return null;
}

export function estIdentifiantArticle(valeur: unknown): valeur is string {
  return (
    typeof valeur === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valeur)
  );
}

export function creerBaseSlug(titre: string): string {
  return (
    titre
      .toLowerCase()
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80)
      .replace(/-+$/g, "") || "article"
  );
}

export function texteVersDocument(texte: string) {
  const paragraphes = texte
    .replace(/\r\n?/g, "\n")
    .split(/\n+/)
    .map((paragraphe) => paragraphe.trim())
    .filter(Boolean);

  return {
    type: "doc",
    content: paragraphes.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  };
}

function estObjet(valeur: unknown): valeur is Record<string, unknown> {
  return typeof valeur === "object" && valeur !== null && !Array.isArray(valeur);
}

// null signifie que le document contient une structure non prise en charge.
export function lireParagraphes(contenu: unknown): string[] | null {
  if (
    !estObjet(contenu) ||
    contenu.type !== "doc" ||
    !Array.isArray(contenu.content)
  ) {
    return null;
  }

  const paragraphes: string[] = [];

  for (const bloc of contenu.content) {
    if (!estObjet(bloc) || bloc.type !== "paragraph") return null;

    if (bloc.content === undefined) {
      paragraphes.push("");
      continue;
    }

    if (!Array.isArray(bloc.content)) return null;

    let texte = "";
    for (const noeud of bloc.content) {
      if (
        !estObjet(noeud) ||
        noeud.type !== "text" ||
        typeof noeud.text !== "string"
      ) {
        return null;
      }
      texte += noeud.text;
    }

    paragraphes.push(texte);
  }

  return paragraphes;
}

// Refuser l'édition si elle ferait perdre des attributs ou une mise en forme.
export function textePourEdition(contenu: unknown): string | null {
  const paragraphes = lireParagraphes(contenu);
  if (paragraphes === null) return null;

  function estSimple(noeud: unknown): boolean {
    if (!estObjet(noeud)) return false;
    if (Object.keys(noeud).some((cle) => !["type", "content", "text"].includes(cle))) {
      return false;
    }
    return !Array.isArray(noeud.content) || noeud.content.every(estSimple);
  }

  return estSimple(contenu) ? paragraphes.join("\n") : null;
}
