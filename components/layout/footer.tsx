import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";





export default function Footer() {
  return (
    <footer className="bg-(--odyssey-ocean) text-(--odyssey-sand) p-1">
    <nav className="grid grid-cols-1 md:grid-cols-3 items-center gap-4" aria-label="Navigation de pied de page">
      <div className="footbar-logo">
         <Link href="/">Odyssée Kréyol</Link>
      </div>

      <div className="navbar-links justify-center flex-wrap">
        <Link href="/">Accueil</Link>
        <Link href="/articles">Articles</Link>
        <Link href="/about">À propos</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/politique-confidentialite">Politique de confidentialité</Link>
        <a href="https://www.instagram.com/" aria-label="Accueil instagram"><FaInstagram /></a>
        <a href="https://x.com/" aria-label="Accueil X"><FaXTwitter /></a>
        <a href="https://www.facebook.com/" aria-label="Accueil Facebook"><FaFacebook /></a>
      </div>
    </nav>
    <p className="text-sm mt-2 text-center">© 2026 Odyssée Kréyol</p>        
    </footer>

  )
}