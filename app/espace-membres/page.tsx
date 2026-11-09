
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export default async function EspaceMembres(){
    const supabase = await createClient();

    const{data, error} = await supabase.auth.getClaims(); //permet de verifier les infos de le session côté server

    if (error || !data?.claims) {
        redirect("/connexion")
    }

    return(
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="text-2xl font-semibold">Espace Membres</h1>
            <p className="mt-4">Bienvenue dans ton Espace Membres</p>
        </main>
    )
}