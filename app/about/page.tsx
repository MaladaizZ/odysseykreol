import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos | Odyssée Kréyol",
  description:
    "Découvrez l’histoire et la vision d’Odyssée Kréyol, un espace pour partager la Guadeloupe et ses récits.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl text-(--odyssey-ocean)">
      <article>
        <h1 className="text-3xl font-semibold sm:text-4xl">
          À propos d’Odyssée Kréyol
        </h1>

        <div className="mt-6 space-y-5 text-lg leading-relaxed">
          <p>
            Je m’appelle Borys. Né en Guadeloupe, j’ai eu la chance de voyager
            dans plusieurs pays. Où que je sois, j’ai toujours eu envie de
            partager d’où je viens : la Guadeloupe. Sa beauté, ses paysages,
            sa culture et les personnes qui la font vivre me tiennent
            particulièrement à cœur.
          </p>

          <p>
            Avec Odyssée Kréyol, je souhaite créer un espace où l’on peut voyager
            à travers des histoires, découvrir la Guadeloupe à travers le regard
            de ses habitants et aller à la rencontre de celles et ceux qui la
            font vivre. C’est aussi une invitation pour les habitants et les
            acteurs locaux à partager leurs expériences, leurs savoirs et leurs
            activités, afin de se faire connaître.
          </p>

          <p>
            Que vous soyez d’ici ou d’ailleurs, curieux de découvrir la
            Guadeloupe ou désireux de raconter un morceau de votre histoire,
            rejoignez-nous pour partager et vivre l’expérience Odyssée Kréyol.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/articles"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-(--odyssey-ocean) px-6 py-3 font-semibold text-(--odyssey-sand) hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--odyssey-lagoon)"
          >
            Découvrir les articles
          </Link>
          <Link
            href="/inscription"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-(--odyssey-ocean) px-6 py-3 font-semibold hover:bg-(--odyssey-turquoise)/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--odyssey-lagoon)"
          >
            Rejoindre la communauté
          </Link>
        </div>

        <figure className="mt-10">
          <Image
            src="/borys00.JPEG"
            alt="Un adulte et un enfant main dans la main face à un paysage de montagnes."
            width={2048}
            height={1536}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-2xl"
          />
        </figure>
      </article>
    </main>
  );
}
