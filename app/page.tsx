import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ArticleCard from "@/components/article-card";


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


export default function Home() {
  return (
   
    <main className="flex flex-1 flex-col bg-(--odyssey-sand) text-(--odyssey-ocean)">
      
      <section className="flex flex-col justify-center items-center md:px-8 gap-4 max-w-6xl w-full px-4 py-12 mx-auto flex-1">
        <h1 className="text-2xl md:text-4xl">
         La Guadeloupe se raconte ici.
        </h1>
        <p>Rencontre entre tradition et évasion</p>
        <p>Odyssey est une plateforme qui permet de découvrir la Guadeloupe comme si on y était.
           Venez à la rencontre de ceux qui vivent la Guadeloupe.  Quoi faire ? Que voir ? Que manger ? Où aller ?
           Pour le savoir laissez-vous guider par Odyssey.  Retrouvez des adresses peu communes, des lieux loin des trajets touristiques, les secrets de la culture locale et des merveilles gastronomiques.
        </p>
        <Link href="/about" className="bg-(--odyssey-ocean) text-(--odyssey-sand) hover:opacity-80 hover:scale-105 duration-200 py-3 px-6 rounded-lg font-semibold focus-visible:outline-2">
         Découvrir Odyssée
         </Link>
         <Link href="/contact" className={buttonVariants({variant: "outline", size:"default"})}>
         Contact
         </Link>
      </section>

      <section className="flex flex-col justify-center items-center md:px-8 gap-4 w-full px-4 py-12 mx-auto flex-1">
        <h2 className="text-xl md:text-2xl font-semibold">
          À découvrir
        </h2>
        <p> Les randonnées à faire, les évènements du mois, le proverbe. </p>
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
        <h2 className="text-xl md:text-2xl font-semibold">Histoire Locale</h2>
        <p>La Guadeloupe possède une histoire marquée par de nombreuses figures,
          notamment Solitude, symbole de résistance et de liberté. Son histoire,
          transmise à travers les générations, évoque pour moi la force des femmes
          guadeloupéennes : fanm doubout, fanm poto mitan.
        </p>
        </section>
    </main>
   
  );
}
