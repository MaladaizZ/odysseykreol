"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ConnexionPage() {
  const [message, setMessage] = useState("");
  const [chargement, setChargement] = useState(false);
  const router = useRouter();

  async function connexion(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formulaire = new FormData(event.currentTarget);
    const email = String(formulaire.get("email") ?? "").trim();
    const password = String(formulaire.get("password") ?? "");

    setMessage("");
    setChargement(true);

    try {
      const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

      if (error) {
        setMessage("Connexion impossible. Vérifie ton e-mail et ton mot de passe.");
      } else {
        setMessage("Connexion réussie.");
        router.refresh(); // adapte le rendu si connecté
      }
    } catch {
      setMessage("Une erreur est survenue pendant la connexion.");
    } finally {
      setChargement(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold">Connexion</h1>

      <form onSubmit={connexion} className="mt-6 flex flex-col gap-4">
        <label htmlFor="email">Adresse e-mail</label>
        <input
          id="email"
          placeholder="Votre mail ici"
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
          autoComplete="current-password"
          required
          className="rounded-lg border p-2"
        />

        <button
          type="submit"
          disabled={chargement}
          className="rounded-lg bg-(--odyssey-ocean) p-2 text-(--odyssey-sand) disabled:opacity-60"
        >
          {chargement ? "Connexion en cours..." : "Se connecter"}
        </button>

        <p role="status">{message}</p>
      </form>
    </main>
  );
}