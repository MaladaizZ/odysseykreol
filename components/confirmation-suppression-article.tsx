"use client";

import { useActionState } from "react";
import { supprimerArticle, type EtatSuppression } from "@/app/mes-articles/actions";

export default function ConfirmationSuppressionArticle({
  articleId,
  action,
}: {
  articleId: string;
  action?: (
    etat: EtatSuppression,
    formulaire: FormData,
  ) => Promise<EtatSuppression>;
}) {
  const [etat, actionSuppression, enCours] = useActionState(
    action ?? supprimerArticle.bind(null, articleId),
    { message: "" },
  );

  return (
    <form action={actionSuppression} className="mt-6 flex flex-col gap-4">
      <label className="flex items-start gap-2">
        <input
          name="confirmation"
          type="checkbox"
          value="oui"
          required
          className="mt-1"
        />
        Je confirme la suppression définitive de cet article.
      </label>
      <p role="alert">{etat.message}</p>
      <button
        type="submit"
        disabled={enCours}
        className="rounded-lg border-2 border-(--odyssey-ocean) p-2 font-semibold disabled:opacity-60"
      >
        {enCours ? "Suppression en cours…" : "Supprimer définitivement"}
      </button>
    </form>
  );
}
