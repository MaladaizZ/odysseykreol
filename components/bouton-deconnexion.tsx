"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

export default function BoutonDeconnexion() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function deconnexion() {
    setMessage("");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut();

      if (error) {
        setMessage(
          "La déconnexion a échoué." // si supabase renvoi une erreur 
        );
      }

      router.refresh();
    } catch {
      setMessage("Une erreur est survenue pendant la déconnexion.");
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={deconnexion}
        className="rounded-lg bg-(--odyssey-ocean) p-2 m-2 text-(--odyssey-sand) hover:opacity-80 hover:scale-105 duration-200 cursor-pointer "
      >
        Se déconnecter
      </button>

      <p role="status">{message}</p>
    </div>
  );
}