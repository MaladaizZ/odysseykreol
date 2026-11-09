import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/supabase/server";

type SessionServeur = {
  utilisateur: User | null;
  administrateur: boolean;
};

export const obtenirSession = cache(async (): Promise<SessionServeur> => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return { utilisateur: null, administrateur: false };
    }

    return {
      utilisateur: data.user,
      administrateur: data.user.app_metadata?.role === "admin",
    };
  } catch (erreur) {
    console.error("Erreur de vérification de la session :", erreur);
    return { utilisateur: null, administrateur: false };
  }
});
