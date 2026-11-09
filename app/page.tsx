import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";
import { createClient } from "@/src/lib/supabase/server";

type ArticleAccueil = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
};

const articles= [ 
  {
  id:'randonnees',
  nom: 'les randonnées',
  description: 'Les randonnées à ne pas manquer sont bien évidemment la Soufrière mais pas pour débutant.La pointe des Châteaux est à faire absolument',
},
{
  id: 'visites',
  nom: 'les lieux',
  description: 'à faire même quand on est pas sportif'
}
];


export default async function Home() {
  const supabase = await createClient();
  let derniersArticles: ArticleAccueil[] = [];
  let erreurChargement = false;

  try {
    const { data, error } = await supabase
      .schema("public")
      .from("articles")
      .select("id, title, slug, excerpt")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Erreur de chargement des derniers articles :", error.code);
      erreurChargement = true;
    } else {
      derniersArticles = data ?? [];
    }
  } catch {
    console.error("Impossible de charger les derniers articles.");
    erreurChargement = true;
  }

  return (
   
    <main className="flex w-full flex-1 flex-col bg-(--odyssey-sand) text-(--odyssey-ocean)">
      
      <section className="flex flex-col justify-center items-center md:px-8 gap-4 max-w-6xl w-full px-4 py-12 mx-auto flex-1">
        <h1 className="text-center text-2xl md:text-4xl">
         La Guadeloupe se raconte ici.
        </h1>
        <p>Rencontre entre tradition et évasion</p>
        <p>Odyssée Kréyol est un espace pour lire et partager des articles sur la
          Guadeloupe. Culture, histoire, vie quotidienne et témoignages : découvrez
          les récits de celles et ceux qui font vivre le territoire.
        </p>
        <Link href="/about" className="bg-(--odyssey-ocean) text-(--odyssey-sand) hover:opacity-80 hover:scale-105 duration-200 py-3 px-6 rounded-lg font-semibold focus-visible:outline-2">
         Découvrir Odyssée
         </Link>
         <Link href="/contact" className={buttonVariants({variant: "outline", size:"default"})}>
         Contact
         </Link>
      </section>

      <section
        aria-labelledby="derniers-articles"
        className="flex flex-col items-center gap-4 max-w-6xl w-full px-4 py-12 mx-auto md:px-8"
      >
        <h2 id="derniers-articles" className="text-xl md:text-2xl font-semibold">
          Derniers articles
        </h2>
        <p className="text-center">Les dernières publications de la communauté.</p>

        {erreurChargement ? (
          <p role="alert" className="text-center">
            Les derniers articles sont momentanément indisponibles.
          </p>
        ) : derniersArticles.length === 0 ? (
          <p className="text-center">Aucun article publié pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {derniersArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="block min-w-0 rounded-lg hover:outline-2 hover:outline-offset-2 hover:outline-(--odyssey-lagoon) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--odyssey-ocean)"
              >
                <ArticleCard nom={article.title} description={article.excerpt} />
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/articles"
          className="bg-(--odyssey-ocean) text-(--odyssey-sand) hover:opacity-80 hover:scale-105 duration-200 py-3 px-6 rounded-lg font-semibold focus-visible:outline-2"
        >
          Voir tous les articles
        </Link>
      </section>

      <section className="flex flex-col justify-center items-center md:px-8 gap-4 w-full px-4 py-12 mx-auto flex-1">
        <h2 className="text-xl md:text-2xl font-semibold">
          À découvrir
        </h2>
        <p> Les randonnées à faire, les évènements du moments, quelques proverbes. </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {articles.map((article)=> (
            <ArticleCard
            key={article.id}
            nom={article.nom}
            description={article.description}
          />
        ))}
          <article className="bg-(--odyssey-turquoise) rounded-lg p-2">
          <h3 className="font-semibold">Le proverbe :</h3>
          <p><cite title="le proverbe est un adage de courage on n'y est presque ">&quot;Bo dlanmè pa lwen&quot;</cite> : veut dire la Lumiere est au bout du tunnel</p>
          </article>          
        </div>
      </section>

      <section className="flex flex-col justify-center items-center md:px-8 gap-4  w-full px-4 py-12 mx-auto flex-1 border-t-2 border-(--odyssey-turquoise) rounded-t-2xl">
        <h2 className="text-xl md:text-2xl font-semibold">Histoires Locales</h2>
        <p>La Guadeloupe possède une histoire marquée par de nombreuses figures,
          notamment Solitude, symbole de résistance et de liberté. Son histoire,
          transmise à travers les générations, évoque pour moi la force des femmes
          guadeloupéennes : fanm doubout, fanm poto mitan.
        </p>
        </section>
    </main>
   
  );
}
