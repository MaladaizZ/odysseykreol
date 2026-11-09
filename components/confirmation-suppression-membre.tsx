"use client";

import { useActionState } from "react";
import { supprimerMembre } from "@/app/admin/membres/actions";

export default function ConfirmationSuppressionMembre({
  membreId,
}: {
  membreId: string;
}) {
  const [etat, actionSuppression, enCours] = useActionState(
    supprimerMembre.bind(null, membreId),
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
        Je confirme la suppression définitive de ce compte. Ses articles seront
        conservés sans être associés à ce compte.
      </label>
      <p role="alert">{etat.message}</p>
      <button
        type="submit"
        disabled={enCours}
        className="rounded-lg border-2 border-(--odyssey-ocean) p-2 font-semibold disabled:opacity-60"
      >
        {enCours ? "Suppression en cours…" : "Supprimer définitivement le compte"}
      </button>
    </form>
  );
}
