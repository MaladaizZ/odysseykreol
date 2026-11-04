import Link from "next/link"


export default function notFound() {
    return (
        <main>
            <section className="flex flex-col items-center gap-4 text-center">
                <h1>Page introuvable</h1>
                <h2>4 0 4</h2>
                <p>Il semblerai que vous vous soyez perdu l&apos;ami. . . </p>

                <Link href="/" className="bg-(--odyssey-ocean) text-(--odyssey-sand) hover:opacity-80 hover:scale-105 duration-200 py-3 px-6 rounded-lg font-semibold focus-visible:outline-2 p-4">
                Pa pèd Chimen aw !                
                </Link>

            </section>
        </main>
    )

}