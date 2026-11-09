"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import BoutonDeconnexion from "@/components/bouton-deconnexion";

type MenuNavigationProps = {
  connecte: boolean;
  administrateur: boolean;
};

export default function MenuNavigation({
  connecte,
  administrateur,
}: MenuNavigationProps) {
  const [ouvert, setOuvert] = useState(false);
  const boutonMenu = useRef<HTMLButtonElement>(null);

  function fermerMenu() {
    setOuvert(false);
  }

  return (
    <>
      <button
        ref={boutonMenu}
        type="button"
        className="bouton-menu-mobile size-11 inline-flex md:hidden"
        aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={ouvert}
        aria-controls="liens-navigation"
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="w-full" aria-hidden="true">{ouvert ? "✕" : "☰"}</span>
        
      </button>

      <div
        id="liens-navigation"
        className="navbar-links flex-wrap items-center"
        data-ouvert={ouvert}
        onKeyDown={(event) => {
          if (event.key === "Escape" && ouvert) {
            fermerMenu();
            boutonMenu.current?.focus();
          }
        }}
      >
        <Link href="/" onClick={fermerMenu}>
          Accueil
        </Link>

        <Link href="/articles" onClick={fermerMenu}>
          Articles
        </Link>

        <Link href="/about" onClick={fermerMenu}>
          À propos
        </Link>

        <Link href="/contact" onClick={fermerMenu}>
          Contact
        </Link>

        {connecte ? (
          <>
            <Link href="/articles/ecrire" onClick={fermerMenu}>
              Écrire un article
            </Link>

            <Link href="/mes-articles" onClick={fermerMenu}>
              Mes articles
            </Link>

            <Link href="/espace-membres" onClick={fermerMenu}>
              Espace membres
            </Link>

            {administrateur && (
              <Link href="/admin" onClick={fermerMenu}>
                Administration
              </Link>
            )}

            <BoutonDeconnexion />
          </>
        ) : (
          <>
            <Link href="/inscription" onClick={fermerMenu}>
              Inscription
            </Link>

            <Link href="/connexion" onClick={fermerMenu}>
              Connexion
            </Link>
          </>
        )}
      </div>
    </>
  );
}
