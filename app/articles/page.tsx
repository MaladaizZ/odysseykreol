import ListeArticles from "@/components/liste-articles";

export const metadata = {
  title: "Articles | Odyssée Kréyol",
  description:
    "Découvrez des articles sur la culture et les richesses de la Guadeloupe.",
};

export default function Articles() {
  return (
    <main className="w-full">
      <section>
        <h1 className="text-center">Articles</h1>
        <p>les articles qui définissent la Guadeloupe : </p>

        <ListeArticles />
      </section>
    </main>
  );
}