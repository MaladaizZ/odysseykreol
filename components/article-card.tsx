

export default function ArticleCard({ nom, description }: {nom: string, description: string}) {
  return (
        <article className="bg-(--odyssey-turquoise) rounded-lg p-2 h-40">
          <h3 className="font-semibold line-clamp-2">{nom}</h3>
          <p className="line-clamp-3">{description}</p>
        </article>
        
  );
}

 