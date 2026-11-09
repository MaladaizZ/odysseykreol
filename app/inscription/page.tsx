"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { createClient } from "@/src/lib/supabase/client";

export default function InscriptionPage() {
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);

  async function inscription(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formulaire = new FormData(event.currentTarget);
    const email = String(formulaire.get("email") ?? "").trim();
    const password = String(formulaire.get("password") ?? "");

    setMessage("");
    setChargement(true);

    try {
    const supabase = createClient();

        const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/connexion`,
        },
        });
    if (error) {
        console.log("erreur supabase : ", error.code, error.status);
        setMessage("L'inscription a échoué. Vérifie les informations saisies.");
    } else {
        setMessage(
        "Demande reçue. Si un e-mail de confirmation a été envoyé, consulte ta boîte de réception."
        );
    }
    } catch {
    setMessage("Impossible de contacter le service d'inscription.");
    } finally {
    setChargement(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Créer un compte</h1>

      <form onSubmit={inscription} className="mt-6 flex flex-col gap-4">
        <label htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          placeholder="Votre adresse mail ici"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border p-2"
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          placeholder="Votre mot de passe ici"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="rounded-lg border p-2"
        />

        <button
          type="submit"
          disabled={chargement}
          className="rounded-lg bg-(--odyssey-ocean) p-2 text-(--odyssey-sand) hover:opacity-80 hover:scale-105 duration-200 disabled:opacity-60 cursor-pointer"
        >
          {chargement ? "Inscription en cours..." : "S'inscrire"}
        </button>

        <p role="status">{message}</p>
      </form>
    </main>
  );
}