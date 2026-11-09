import { createClient } from "@/src/lib/supabase/server";
import BoutonDeconnexion from "@/components/bouton-deconnexion";

export default async function TestSessionPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Test de session</h1>

      <BoutonDeconnexion />

      {data?.claims ? (
        <p>Une session a été reconnue côté serveur.</p>
      ) : (
        <p>Aucune session vérifiée ou vérification impossible.</p>
      )}

      {error && (
  <p>
    Erreur : {error.name} — Code : {error.code ?? "non disponible"}
  </p>
)}
    </main>
  );
}