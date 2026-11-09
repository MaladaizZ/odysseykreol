import FormulaireArticle from "@/components/formulaire-article";
import { publierArticle } from "./actions";

export default function FormulairePublication() {
  return (
    <FormulaireArticle
      action={publierArticle}
      valeursInitiales={{ titre: "", resume: "", contenu: "" }}
      libelleBouton="Publier l’article"
      libelleEnCours="Publication en cours…"
    />
  );
}
