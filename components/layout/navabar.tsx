import React from 'react';
import Link from "next/link";




export default function Navbar() {
  return (
    <nav className="navbar flex-wrap" aria-label="Navigation principale">
      <div className="navbar-logo">
         <Link href="/">Odyssée Kréyol</Link>
      </div>

      <div className="navbar-links">
        <Link href="/">Accueil</Link>
        <Link href="/articles">Articles</Link>
        <Link href="/about">À propos</Link>
        <Link href="/contact">Contact</Link>

      </div>
    </nav>
  )
}