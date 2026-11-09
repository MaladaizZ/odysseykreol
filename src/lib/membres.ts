export const LIMITES_MOT_DE_PASSE = { minimum: 12, maximum: 128 };

export function estIdentifiantMembre(valeur: unknown): valeur is string {
  return (
    typeof valeur === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valeur)
  );
}

export function estEmailValide(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function estNouveauMotDePasseValide(motDePasse: string): boolean {
  return (
    motDePasse.length >= LIMITES_MOT_DE_PASSE.minimum &&
    motDePasse.length <= LIMITES_MOT_DE_PASSE.maximum &&
    /\S/.test(motDePasse)
  );
}
