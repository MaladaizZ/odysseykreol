import Link from "next/link";
import { obtenirSession } from "@/src/lib/session";
import MenuNavigation from './menu-navigation';




export default async function Navbar() {
   
  const { utilisateur, administrateur } = await obtenirSession();

  return (
    <nav className="navbar flex-wrap " aria-label="Navigation principale">
      <div className="navbar-logo">
         <Link href="/">Odyssée Kréyol</Link>
      </div>

        <MenuNavigation
          connecte={Boolean(utilisateur)}
          administrateur={administrateur}
        />
        
    </nav>
  )
}
