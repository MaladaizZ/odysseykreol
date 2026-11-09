import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales | Odyssée Kréyol",
  description: "Informations sur l’éditeur et l’hébergement du site Odyssée Kréyol.",
};

export default function MentionsLegales() {
  return (
    <main className="mx-auto w-full max-w-3xl text-(--odyssey-ocean)">
      <h1 className="text-3xl font-semibold sm:text-4xl">Mentions légales</h1>
      <p className="mt-4 leading-relaxed">
        Ces mentions sont en cours de préparation et doivent être complétées avant
        l’ouverture publique du site.
      </p>

      <section className="mt-8" aria-labelledby="editeur">
        <h2 id="editeur" className="text-xl font-semibold">Éditeur du site</h2>
        <div className="mt-3 space-y-2 leading-relaxed">
          <p>Borys MARESTER, entrepreneur individuel (EI), développeur freelance.</p>
          <p>Adresse de domiciliation : 16 rue Chevalier de la Barre, 59260 Hellemmes.</p>
          <p>
            E-mail : <a className="underline" href="mailto:b.marester@gmail.com">b.marester@gmail.com</a>
          </p>
          <p>
            Téléphone : <a className="underline" href="tel:+33769787297">07 69 78 72 97</a>
          </p>
          <p>Numéro d’immatriculation et registre applicable : à compléter avant la mise en ligne.</p>
          <p>Numéro de TVA intracommunautaire : à renseigner si applicable.</p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="publication">
        <h2 id="publication" className="text-xl font-semibold">Direction de la publication</h2>
        <p className="mt-3 leading-relaxed">Directeur de la publication : Borys MARESTER.</p>
      </section>

      <section className="mt-8" aria-labelledby="hebergement">
        <h2 id="hebergement" className="text-xl font-semibold">Hébergement</h2>
        <p className="mt-3 leading-relaxed">
          Hébergeur prévu : Vercel. La dénomination exacte, l’adresse et le numéro
          de téléphone de l’hébergeur sont à compléter après confirmation du contrat.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="contenus">
        <h2 id="contenus" className="text-xl font-semibold">Contenus du site</h2>
        <p className="mt-3 leading-relaxed">
          Les textes, images et autres contenus appartiennent à leurs titulaires
          respectifs. Leur réutilisation doit respecter les droits et les
          autorisations applicables.
        </p>
      </section>

      <section className="mt-8" aria-labelledby="donnees">
        <h2 id="donnees" className="text-xl font-semibold">Données personnelles</h2>
        <p className="mt-3 leading-relaxed">
          Les informations relatives aux données personnelles sont présentées dans
          notre <Link className="underline" href="/politique-confidentialite">politique de confidentialité</Link>.
        </p>
      </section>
    </main>
  );
}
