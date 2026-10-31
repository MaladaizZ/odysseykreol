import React from 'react';
import Link from "next/link";



// installer le component MUI avec la CLI
export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Navigation principale">
      <div className="navbar-logo">
         <Link href="/">Odyssée Kréyol</Link>
      </div>

      <div className="navbar-links">
        <Link href="/">Accueil</Link>
        <Link href="/about">A propos</Link>
        <Link href="/contact">Contact</Link>

      </div>
    </nav>
  )
}