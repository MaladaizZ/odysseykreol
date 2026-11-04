
// regle pour respecter le type des articles :  
type Article = {
  slug: string;
  titre: string;
  description: string;
  contenu: string;
};

export const articles: Article[] = [
  {
    slug: "quennettes",
    titre: "Quenettes",
    contenu: "Fruit juteux et très sucré qui rappelle vaguement le litchi.",
    description:"fruit de saison"
  },
  {
    slug: "mangue",
    titre: "Mangue",
    contenu: "Fruit de taille moyenne, juteux et avec un gros noyau.",
    description: "fruit connu mondialement"
  },
  {
    slug:"maracudja",
    titre:"Maracudja",
    contenu:"fruit emblématique des Antilles",
    description:"aussi appelé fruit de la passion"
  },
  {
  slug: "gwoka",
  titre: "Le Gwoka",
  description: "Un article consacré au gwoka.",
  contenu: "Cet article est en cours de rédaction.",
},
];