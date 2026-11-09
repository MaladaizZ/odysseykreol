import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = {
  title: "Contact | Odyssée Kréyol",
  description:
    "Une question, une idée d’article ou un témoignage ? Retrouvez les coordonnées d’Odyssée Kréyol pour nous écrire.",
};

const email = "b.marester@gmail.com";
const adresse = "16 rue Chevalier de la Barre, 59260 Hellemmes";
const adresseRecherche = `${adresse}, France`;
const lienGoogleMaps =
  "https://www.google.com/maps/search/?" +
  new URLSearchParams({ api: "1", query: adresseRecherche }).toString();

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl text-(--odyssey-ocean)">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold sm:text-4xl">Contact</h1>
        <p className="mt-4 text-lg leading-relaxed">
          Une question ou une envie de contribuer à Odyssée Kréyol ? Écrivez-nous :
          vos messages font vivre les échanges autour de la Guadeloupe.
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section
          aria-labelledby="contact-email"
          className="min-w-0 rounded-2xl border border-(--odyssey-lagoon)/20 bg-(--odyssey-turquoise)/15 p-6 sm:p-8"
        >
          <h2 id="contact-email" className="text-xl font-semibold">
            N'hésitez pas !  Et écrivez-nous
          </h2>
          <p className="mt-3 leading-relaxed">
            Retrouvez-nous par e-mail pour partager vos questions et vos envies.
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-3 inline-block break-all rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--odyssey-lagoon)"
          >
            {email}
          </a>
          <div>
            <a
              href={`mailto:${email}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 min-h-11 w-full bg-(--odyssey-ocean) px-6 text-(--odyssey-sand) hover:bg-(--odyssey-lagoon) sm:w-auto",
              )}
            >
              Nous écrire
            </a>
          </div>
        </section>

        <section
          aria-labelledby="contact-sujets"
          className="rounded-2xl border border-(--odyssey-lagoon)/20 p-6 sm:p-8"
        >
          <h2 id="contact-sujets" className="text-xl font-semibold">
            Mettons à l'honneur vos idées
          </h2>
          <p className="mt-3 leading-relaxed">
            Une question, une idée d’article, un témoignage à partager, une erreur
            à nous signaler ou une proposition de partenariat : nous sommes à
            votre écoute.
          </p>
        </section>
      </div>

      <section
        aria-labelledby="contact-adresse"
        className="mt-6 overflow-hidden rounded-2xl border border-(--odyssey-lagoon)/20"
      >
        <div className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="contact-adresse" className="text-xl font-semibold">
              Notre adresse
            </h2>
            <address className="mt-3 not-italic leading-relaxed">{adresse}</address>
          </div>
          <a
            href={lienGoogleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-(--odyssey-ocean) px-4 py-3 text-center font-semibold underline underline-offset-4 hover:bg-(--odyssey-turquoise)/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--odyssey-lagoon)"
          >
            Ouvrir dans Google Maps
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        </div>

        <iframe
          title={`Carte Google Maps : ${adresse}`}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2531.1727997090097!2d3.0953110777069752!3d50.623906671626344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2d5e20a9aa6bb%3A0x2d3c0bcf5fb85a87!2s16%20Rue%20Chevalier%20de%20la%20Barre%2C%2059800%20Lille!5e0!3m2!1sfr!2sfr!4v1794243295211!5m2!1sfr!2sfr"
          width="800"
          height="400"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[400px] w-full border-0"
        />
      </section>
    </main>
  );
}
