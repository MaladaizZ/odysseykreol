"use client";

import { useState } from "react";
import ArticleCard from "@/components/article-card";
import Link from "next/link";

export default function ListeArticles({articles}) {
  const [recherche, setRecherche] = useState("");
  
  //mettre la searchbar avec majuscule et ignorer les espaces.
  const articlesFiltres = articles.filter((article) =>
  article.titre.toLowerCase().includes(recherche.trim().toLowerCase())
);

  return (
    <>
      <label htmlFor="recherche-articles">
        Rechercher un article : 
      </label>

      <input
        id="recherche-articles"
        type="text"
        value={recherche}
        onChange={(event) => setRecherche(event.target.value)}
        className="border rounded-lg p-2 mt-1"
      />

    

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {articlesFiltres.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
          >
            <ArticleCard
              nom={article.titre}
              description={article.description}
            />
          </Link>
        ))}
      </div>
    </>
  );
}