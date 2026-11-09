"use client";

import { useActionState } from "react";
import { modifierMembre } from "@/app/admin/membres/actions";
import { LIMITES_MOT_DE_PASSE } from "@/src/lib/membres";

export default function FormulaireMembre({
  membreId,
  emailInitial,
}: {
  membreId: string;
  emailInitial: string;
}) {
  const [etat, actionModification, enCours] = useActionState(
    modifierMembre.bind(null, membreId),
    { message: "", email: emailInitial },
  );

  return (
    <form action={actionModification} className="mt-6 flex flex-col gap-4">
      <label htmlFor="email-membre">Adresse e-mail</label>
      <input
        id="email-membre"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        defaultValue={etat.email}
        className="w-full rounded-lg border p-2"
      />

      <label htmlFor="mot-de-passe-membre">Nouveau mot de passe</label>
      <p id="aide-mot-de-passe-membre" className="text-sm">
        Laisse ce champ vide pour conserver le mot de passe actuel. Sinon, saisis
        entre 12 et 128 caractères.
      </p>
      <input
        id="mot-de-passe-membre"
        name="motDePasse"
        type="password"
        autoComplete="new-password"
        minLength={LIMITES_MOT_DE_PASSE.minimum}
        maxLength={LIMITES_MOT_DE_PASSE.maximum}
        aria-describedby="aide-mot-de-passe-membre"
        className="w-full rounded-lg border p-2"
      />

      <p className="text-sm">Les changements prennent effet directement sur le compte.</p>
      <p role="alert">{etat.message}</p>
      <button
        type="submit"
        disabled={enCours}
        className="rounded-lg bg-(--odyssey-ocean) p-2 text-(--odyssey-sand) disabled:opacity-60"
      >
        {enCours ? "Enregistrement…" : "Enregistrer les modifications"}
      </button>
    </form>
  );
}
