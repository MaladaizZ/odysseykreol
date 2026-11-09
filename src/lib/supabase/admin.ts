import "server-only";

import { createClient } from "@supabase/supabase-js";

export class ErreurConfigurationAdministration extends Error {
  constructor() {
    super("La gestion des comptes n’est pas configurée correctement côté serveur.");
    this.name = "ErreurConfigurationAdministration";
  }
}

// Vérifier obtenirSession() et le rôle administrateur AVANT tout appel à ce client.
// Il est indépendant des cookies de connexion et ne doit jamais être transmis au navigateur.
export function creerClientAdministration() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (
    !url ||
    !cle ||
    cle.startsWith("sb_publishable_") ||
    cle === process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new ErreurConfigurationAdministration();
  }

  return createClient(url, cle, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, options) => fetch(input, { ...options, cache: "no-store" }),
    },
  });
}
