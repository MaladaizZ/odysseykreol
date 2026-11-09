"use client";

import { useActionState } from "react";
import {
  LIMITES_ARTICLE,
  type EtatFormulaireArticle,
  type ValeursArticle,
} from "@/src/lib/articles";

type FormulaireArticleProps = {
  action: (
    etat: EtatFormulaireArticle,
    formulaire: FormData,
  ) => Promise<EtatFormulaireArticle>;
  valeursInitiales: ValeursArticle;
  libelleBouton: string;
  libelleEnCours: string;
};

export default function FormulaireArticle({
  action,
  valeursInitiales,
  libelleBouton,
  libelleEnCours,
}: FormulaireArticleProps) {
  const [etat, actionFormulaire, enCours] = useActionState(action, {
    message: "",
    valeurs: valeursInitiales,
  });

  return (
    <form action={actionFormulaire} className="mt-6 flex flex-col gap-4">
      <label htmlFor="titre">Titre</label>
      <input
        id="titre"
        name="titre"
        type="text"
        required
        maxLength={LIMITES_ARTICLE.titre}
        defaultValue={etat.valeurs.titre}
        className="w-full rounded-lg border p-2"
      />
      <label htmlFor="resume">Résumé</label>
      <textarea
        id="resume"
        name="resume"
        required
        maxLength={LIMITES_ARTICLE.resume}
        defaultValue={etat.valeurs.resume}
        rows={4}
        className="w-full rounded-lg border p-2"
      />
      <label htmlFor="contenu">Contenu</label>
      <p id="aide-contenu" className="text-sm">
        Chaque ligne non vide sera affichée comme un paragraphe.
      </p>
      <textarea
        id="contenu"
        name="contenu"
        required
        maxLength={LIMITES_ARTICLE.contenu}
        defaultValue={etat.valeurs.contenu}
        aria-describedby="aide-contenu"
        rows={12}
        className="w-full rounded-lg border p-2"
      />
      <p role="alert">{etat.message}</p>
      <button
        type="submit"
        disabled={enCours}
        className="rounded-lg bg-(--odyssey-ocean) p-2 text-(--odyssey-sand) disabled:opacity-60"
      >
        {enCours ? libelleEnCours : libelleBouton}
      </button>
    </form>
  );
}
