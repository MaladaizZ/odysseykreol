ODYSSEY — DOCUMENT MAÎTRE DU PROJET
Vision, architecture, cahier des charges, feuille de route et instructions pour les IA

Projet : Odyssey
Nom du dossier actuel : odysseykreol
Framework : Next.js 16.3.1
IDE : Visual Studio Code
Langage principal : TypeScript / JavaScript
Date de référence : 30 octobre 2026
Statut : Développement initial — architecture et fonctionnalités en cours de construction.

## PARTIE 1 — VISION ET OBJECTIF DU PROJET
1.1 Présentation

Odyssey est un projet de site web évolutif, construit avec Next.js, dont l'objectif est de proposer une plateforme communautaire permettant aux utilisateurs de consulter, rédiger, publier, modifier et supprimer des articles.

Le projet doit être conçu dès le départ pour pouvoir accueillir de nouvelles fonctionnalités sans devoir reconstruire toute son architecture.

Il  s'agit de développer progressivement une véritable application web.

La plateforme doit pouvoir évoluer vers un environnement communautaire avec des comptes utilisateurs, des contenus publiés par les membres, des interactions et de futurs services.

1.2 Philosophie du projet

Les principes directeurs sont :

Une architecture propre, modulaire et évolutive.
Une interface moderne, intuitive et responsive.
Une expérience utilisateur agréable.
Une sécurité sérieuse des comptes et des données.
Un code maintenable et documenté.
Le respect des standards du Web.
Une bonne accessibilité.
Une optimisation SEO dès la conception.
Une architecture permettant d'ajouter de nouvelles fonctionnalités.
Un déploiement fiable en production.

L'objectif final est de disposer d'une application fonctionnelle, sécurisée, performante et déployée publiquement.

## PARTIE 2 — ENVIRONNEMENT TECHNIQUE
2.1 Technologies retenues
Technologie	Utilisation
Next.js 16.3.1	Framework principal
React	Interface utilisateur
TypeScript	Typage et robustesse
JavaScript / JSX	Composants existants
CSS	Mise en forme
VS Code	Environnement de développement
Supabase	Backend et services de données
PostgreSQL	Base de données
Supabase Auth	Authentification
Supabase Storage	Stockage des images
Tiptap	Éditeur de texte riche
Git / GitHub	Gestion du code et versions

Les choix techniques pourront évoluer si une justification technique sérieuse le nécessite, mais aucune technologie ne doit être remplacée sans expliquer les avantages, les inconvénients et les conséquences de cette décision.

2.2 Environnement de développement

Le développement s'effectue dans Visual Studio Code.

Le projet utilise npm pour la gestion des dépendances.

Commandes principales :

bash
npm install
npm run dev
npm run build
npm run start


Le serveur de développement est accessible normalement sur :

http://localhost:3000

## PARTIE 3 — ÉTAT ACTUEL DU PROJET
3.1 Structure initiale connue

D'après la capture d'écran fournie au début du développement :

text
odysseykeyreol/
├── .next/
├── app/
│   ├── components/
│   │   └── navbar.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── node_modules/
└── ...


Il existe donc deux emplacements distincts :

app/components/
components/ à la racine.

La navbar existante se trouve dans app/components/navbar.js.

Ne pas déplacer ou supprimer ces dossiers sans vérifier leur contenu.

3.2 Première erreur résolue

L'import initial de la navbar dans app/layout.tsx était :

tsx
import { Navbar } from "app/components/navbar.js";


Cela provoquait une erreur de résolution du module.

La correction appliquée est :

tsx
import { Navbar } from "./components/navbar";


Résultat confirmé : l'erreur a disparu.

Le composant utilise un export nommé :

jsx
export function Navbar() {
  return (
    <nav>
      <h1>Odyssey</h1>
    </nav>
  );
}


L'import correspondant est :

tsx
import { Navbar } from "./components/navbar";

3.3 Layout global

Le fichier app/layout.tsx utilise notamment :

Metadata de Next.js.
Geist.
Geist_Mono.
globals.css.
Le composant Navbar.

La navbar doit être intégrée au layout global afin de rester visible sur les pages utilisant ce layout.

Exemple de structure :

tsx
<body>
  <Navbar />
  {children}
</body>


Le code réel du fichier doit être vérifié avant toute modification.

3.4 Pages évoquées

Les routes suivantes ont été proposées :

Route	Fonction
/	Accueil
/about	À propos
/contact	Contact
/articles	Consultation des articles
/inscription	Création d'un compte
/connexion	Connexion
/articles/nouveau	Rédaction d'un article
/articles/[id]	Consultation d'un article
/articles/[id]/modifier	Modification d'un article

Attention : la création effective des pages about, contact et des nouvelles routes n'a pas été confirmée.

Les exemples de code précédemment proposés ne doivent pas être considérés automatiquement comme déjà installés dans le projet.

3.5 Documentation du projet

Un premier fichier de résumé a été créé manuellement :

ODYSSEY_RESUME.md

Il sert de mémoire de développement.

Le présent document doit devenir la référence principale :

ODYSSEY_MASTER_PLAN.md

## PARTIE 4 — FONCTIONNALITÉS FONDAMENTALES
4.1 Gestion des utilisateurs

Les visiteurs doivent pouvoir :

Créer un compte.
Se connecter.
Se déconnecter.
Accéder à leur espace membre.
Gérer leur profil.
Modifier certaines informations personnelles.
Retrouver leurs propres articles.

Le système doit prévoir une gestion propre des sessions et des autorisations.

L'inscription ne doit pas donner automatiquement des privilèges administrateur.

4.2 Gestion des articles

La page /articles doit permettre de consulter les publications des membres.

Chaque article devra comporter au minimum :

Un identifiant unique.
Un titre.
Un contenu.
Un auteur.
Une date de création.
Une date de modification.
Une date de publication.
Un statut de publication.
Des informations de référencement.

Fonctionnalités :

Consulter les articles.
Consulter un article individuellement.
Rédiger un nouvel article.
Modifier ses propres articles.
Supprimer ses propres articles.
Afficher les informations de l'auteur.
Afficher les dates de publication.

Tous les membres authentifiés peuvent publier.

Un membre ne peut modifier ou supprimer que ses propres publications.

Les visiteurs non authentifiés peuvent consulter les articles publiés.

Les articles non publiés doivent rester privés pour les autres membres et les visiteurs.

4.3 Éditeur de texte riche

Le choix retenu est Tiptap.

L'éditeur doit s'inspirer de l'expérience Notion :

Interface épurée.
Grande zone de rédaction.
Barre d'outils discrète.
Titres.
Paragraphes.
Gras.
Italique.
Souligné.
Listes à puces.
Listes numérotées.
Citations.
Liens hypertextes.
Insertion d'images directement dans le contenu.

Le choix est de privilégier l'insertion d'images dans le texte, entre les paragraphes, et non uniquement une image de couverture.

Le contenu de l'éditeur sera enregistré au format JSON natif de Tiptap dans PostgreSQL.

Ne pas enregistrer du HTML non contrôlé et le réinjecter directement dans le navigateur.

Prévoir une validation du contenu, un rendu sécurisé et une gestion des images indépendante du document.

4.4 Gestion des images

Les images seront stockées dans Supabase Storage.

Les fonctionnalités prévues :

Sélection d'une image depuis l'ordinateur.
Téléversement vers Supabase.
Insertion dans le contenu Tiptap.
Affichage des images dans les articles.
Suppression des images devenues inutiles.
Contrôle du propriétaire des fichiers.

Prévoir :

Une validation des types MIME.
Une limite de taille.
Des noms de fichiers sécurisés.
Une gestion des erreurs d'upload.
Une protection contre les fichiers malveillants.
Des règles d'accès cohérentes avec celles des articles.
## PARTIE 5 — ARCHITECTURE TECHNIQUE CIBLE
5.1 Organisation envisagée

Voici une architecture cible indicative :

text
odysseykeyreol/
│
├── app/
│   ├── components/
│   │   └── navbar.js
│   │
│   ├── articles/
│   │   ├── page.tsx
│   │   ├── nouveau/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── modifier/
│   │           └── page.tsx
│   │
│   ├── inscription/
│   │   └── page.tsx
│   │
│   ├── connexion/
│   │   └── page.tsx
│   │
│   ├── profil/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── articles/
│   ├── editor/
│   └── auth/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   │
│   ├── actions/
│   ├── validations/
│   └── utils/
│
├── public/
│
├── proxy.ts
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
│
├── ODYSSEY_RESUME.md
└── ODYSSEY_MASTER_PLAN.md


Cette architecture est une cible évolutive, pas une instruction de créer immédiatement tous ces dossiers.

Ne pas multiplier inutilement les abstractions.

Adapter la structure aux fonctionnalités réelles.

5.2 Supabase

La solution retenue est Supabase.

Pourquoi ?

PostgreSQL relationnel.
Authentification intégrée.
Stockage de fichiers.
Politiques RLS.
Bonne intégration avec Next.js.
Possibilité de faire évoluer l'application.

Documentation :

https://supabase.com/docs

Packages prévus :

bash
npm install @supabase/supabase-js @supabase/ssr

5.3 Variables d'environnement

Le fichier .env.local doit se trouver à la racine.

Variables prévues :

env
NEXT_PUBLIC_SUPABASE_URL=https://TON-PROJET.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_TA_CLE


Les vraies valeurs ne doivent jamais être intégrées au code source ou publiées sur GitHub.

Le fichier .env.local doit être ignoré par Git.

Ne jamais exposer une clé service_role ou une clé secrète dans le navigateur.

5.4 Client navigateur

Fichier cible :

lib/supabase/client.ts

Code proposé :

typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}

5.5 Client serveur

Fichier cible :

lib/supabase/server.ts

Code proposé :

typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Le renouvellement est géré
            // par le proxy Next.js.
          }
        },
      },
    }
  );
}

5.6 Proxy Next.js 16

Next.js 16 utilise proxy.ts au lieu de l'ancien middleware.ts.

Deux fichiers sont prévus :

lib/supabase/proxy.ts

Et à la racine :

proxy.ts

Le proxy devra renouveler les sessions Supabase et transmettre correctement les cookies.

Un premier exemple a été proposé dans la conversation, mais doit être vérifié avec la documentation Supabase et la version exacte de Next.js avant validation définitive.

Il faudra notamment :

Utiliser getClaims() pour vérifier les informations d'authentification.
Respecter la gestion des cookies de la documentation officielle.
Ne pas considérer le proxy comme l'unique mécanisme de contrôle d'accès.
Effectuer les vérifications d'autorisation dans les Server Components, Server Actions ou Route Handlers concernés.

Documentation :

https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs

## PARTIE 6 — BASE DE DONNÉES
6.1 Table articles

Une table articles devra être créée dans PostgreSQL.

Structure indicative :

Champ	Type
id	uuid
author_id	uuid
title	text
slug	text
content	jsonb
excerpt	text
status	text
created_at	timestamptz
updated_at	timestamptz
published_at	timestamptz

La colonne author_id devra référencer l'identifiant de l'utilisateur authentifié.

Le champ content stockera le JSON de Tiptap.

Le champ status permettra de gérer les brouillons et publications.

Les règles métier devront être précisées avant la création définitive du schéma.

6.2 Sécurité RLS

La Row Level Security est indispensable.

Principes :

Les visiteurs peuvent lire les articles publiés.
Un membre authentifié peut créer un article en son nom.
Un membre peut modifier uniquement ses articles.
Un membre peut supprimer uniquement ses articles.
Un utilisateur ne peut pas falsifier author_id.
Les brouillons ne sont pas accessibles aux autres membres.
Les règles doivent être appliquées directement dans PostgreSQL.

Exemple de condition :

sql
auth.uid() = author_id


Cette condition ne constitue qu'un élément de la politique complète.

Les politiques SELECT, INSERT, UPDATE et DELETE doivent être définies séparément et correctement.

Prévoir également les contrôles de propriété pour Supabase Storage.

Documentation :

https://supabase.com/docs/guides/database/postgres/row-level-security

## PARTIE 7 — DESIGN ET EXPÉRIENCE UTILISATEUR
7.1 Identité visuelle

L'identité visuelle définitive reste à concevoir.

La direction retenue pour l'éditeur est :

Inspiration Notion.
Interface moderne et épurée.
Navigation intuitive.
Mise en page aérée.
Typographie lisible.
Hiérarchie visuelle cohérente.

Ne pas imposer arbitrairement une charte graphique définitive sans validation.

7.2 Navbar

La navbar existante devra évoluer pour intégrer :

Accueil.
Articles.
À propos.
Contact.
Inscription.
Connexion.

Après connexion :

Afficher un accès au profil.
Afficher un accès à la rédaction.
Afficher une possibilité de déconnexion.

L'affichage devra dépendre de l'état réel de la session.

Prévoir une version mobile avec un menu adapté.

7.3 Responsive design

Le site doit fonctionner sur :

Ordinateurs.
Tablettes.
Smartphones.

Prévoir des mises en page adaptées aux différentes largeurs d'écran.

Éviter les débordements horizontaux et les éléments difficiles à utiliser au tactile.

## PARTIE 8 — EXIGENCES DE QUALITÉ ET BONNES PRATIQUES

Ces exigences doivent être respectées tout au long du développement.

8.1 Standards W3C et HTML

Respecter les standards du Web :

HTML sémantique.
Structure cohérente des titres.
Formulaires correctement associés à leurs labels.
Attributs alt pertinents pour les images.
Utilisation appropriée des éléments HTML.
Liens et boutons ayant des rôles distincts.
Absence de balisage invalide.

Référence :

https://www.w3.org/

8.2 Accessibilité

Viser les recommandations WCAG 2.2 niveau AA.

Prévoir :

Navigation au clavier.
Contrastes suffisants.
Focus visible.
Libellés explicites.
Messages d'erreur compréhensibles.
Compatibilité avec les lecteurs d'écran.
Alternatives textuelles pour les images.
Respect des préférences de réduction des animations.

Référence :

https://www.w3.org/TR/WCAG22/

8.3 SEO

Le SEO doit être intégré dès la création des pages.

Prévoir :

Métadonnées spécifiques à chaque page.
Titres pertinents.
Descriptions optimisées.
URLs lisibles.
Slugs d'articles uniques.
Balises Open Graph.
Images optimisées.
Sitemap XML.
Robots.txt.
Structure de titres cohérente.
Maillage interne.
Pages publiques indexables.
Pages privées exclues de l'indexation.
Données structurées Schema.org lorsque pertinentes.

Les articles publiés devront bénéficier de métadonnées dynamiques.

Références :

https://developers.google.com/search/docs

https://schema.org/

8.4 Performance

Respecter les bonnes pratiques Next.js :

Utiliser les Server Components par défaut.
Réserver les Client Components aux interactions nécessaires.
Optimiser les images.
Limiter les dépendances.
Éviter les requêtes inutiles.
Prévoir la pagination des articles.
Optimiser les chargements.
Suivre les Core Web Vitals.

Référence :

https://nextjs.org/docs

8.5 Sécurité

La sécurité est une priorité.

Prévoir :

Validation des données côté serveur.
Contrôle des permissions.
Protection des sessions.
RLS PostgreSQL.
Protection des fichiers uploadés.
Gestion des erreurs.
Protection contre les injections.
Limitation des tailles de fichiers.
Contrôle des types MIME.
Protection contre les abus et le spam.
Gestion sécurisée des variables d'environnement.

Ne jamais faire confiance uniquement aux contrôles d'interface.

8.6 Qualité du code

Le code devra être :

Lisible.
Typé.
Modulaire.
Réutilisable lorsque pertinent.
Documenté lorsque nécessaire.
Facile à maintenir.

Éviter les composants gigantesques et les répétitions.

Prévoir progressivement :

ESLint.
TypeScript strict.
Tests unitaires.
Tests d'intégration.
Tests de parcours utilisateur.
Tests de sécurité des permissions.

## PARTIE 9 — FEUILLE DE ROUTE COMPLÈTE
Phase 1 — Fondations
Vérifier le projet Next.js existant.
Vérifier les versions des dépendances.
Vérifier Git et .gitignore.
Créer le projet Supabase.
Récupérer l'URL et la clé publique.
Configurer .env.local.
Installer les packages Supabase.
Créer le client navigateur.
Créer le client serveur.
Configurer le proxy Next.js 16.
Tester la connexion.
Phase 2 — Base de données et sécurité
Concevoir le schéma PostgreSQL.
Créer la table des profils si nécessaire.
Créer la table articles.
Définir les relations.
Configurer RLS.
Tester les permissions.
Créer le bucket de stockage des images.
Définir les politiques Storage.
Vérifier les accès non autorisés.
Phase 3 — Authentification
Page d'inscription.
Page de connexion.
Déconnexion.
Gestion des sessions.
Confirmation d'e-mail.
Gestion des erreurs.
Réinitialisation du mot de passe.
Gestion du profil utilisateur.
Phase 4 — Articles
Page /articles.
Liste des articles publiés.
Affichage des auteurs.
Page de détail.
Gestion des brouillons.
Pagination.
Recherche.
Gestion des slugs.
Phase 5 — Éditeur Tiptap
Installer Tiptap.
Créer le composant Editor.
Créer la barre d'outils.
Ajouter les paragraphes.
Ajouter les titres.
Ajouter le gras et l'italique.
Ajouter les listes.
Ajouter les citations.
Ajouter les liens.
Ajouter l'insertion d'images.
Gérer le téléversement.
Enregistrer le JSON.
Réafficher les contenus.
Tester les modifications.
Phase 6 — Gestion des publications
Création d'article.
Modification.
Suppression.
Publication.
Gestion des brouillons.
Confirmation avant suppression.
Vérification des droits de propriété.
Gestion des erreurs et retours utilisateur.
Phase 7 — Interface et expérience
Finaliser la navbar.
Créer l'espace membre.
Créer le profil.
Finaliser la page d'accueil.
Harmoniser les styles.
Responsive design.
Accessibilité.
États de chargement.
Pages d'erreur.
Notifications utilisateur.
Phase 8 — SEO et performances
Métadonnées.
Sitemap.
Robots.txt.
Open Graph.
Données structurées.
Optimisation des images.
Core Web Vitals.
Vérification de l'indexation.
Audit Lighthouse.
Phase 9 — Tests et sécurité
Tests d'inscription.
Tests de connexion.
Tests de déconnexion.
Tests de publication.
Tests de modification.
Tests de suppression.
Tests RLS.
Tests des fichiers.
Tests mobiles.
Tests de navigation.
Vérification TypeScript.
Vérification ESLint.
Build de production.
Audit de sécurité.
Phase 10 — Déploiement
Préparer le dépôt GitHub.
Vérifier les secrets.
Choisir l'hébergement.
Configurer les variables d'environnement de production.
Configurer les URLs de redirection Supabase.
Configurer le domaine.
Déployer.
Vérifier HTTPS.
Tester l'authentification en production.
Tester les articles et les images.
Vérifier les logs.
Mettre en place les sauvegardes.
Finaliser la mise en production.

Hébergement envisagé : Vercel, à confirmer en fonction des besoins et du budget.

## PARTIE 10 — ÉVOLUTIVITÉ ET FUTURES FONCTIONNALITÉS

Odyssey ne doit pas être limité aux fonctionnalités initiales.

Il est prévu de lui ajouter progressivement de nouvelles possibilités.

Les pistes suivantes sont des propositions, pas des fonctionnalités déjà validées.

Communauté
Commentaires sous les articles.
Réponses aux commentaires.
Profils publics.
Abonnements entre membres.
Système de favoris.
Notifications.
Partage des publications.
Gestion des contenus
Catégories.
Tags.
Recherche avancée.
Filtres.
Articles mis en avant.
Historique des modifications.
Brouillons.
Programmation des publications.
Administration
Tableau de bord administrateur.
Gestion des utilisateurs.
Modération des publications.
Signalement des contenus.
Gestion des abus.
Statistiques de fréquentation.
Fonctionnalités avancées
Notifications en temps réel.
Collaboration.
Système de réputation.
Recommandations d'articles.
Recherche plein texte.
API.
Application mobile éventuelle.

Toute nouvelle fonctionnalité devra être étudiée selon sa valeur réelle, sa complexité, son coût et ses conséquences sur l'architecture.

Ne pas implémenter toutes les possibilités immédiatement.

## PARTIE 11 — DÉPLOIEMENT ET MAINTENANCE

Le projet devra être préparé pour une véritable exploitation.

Il faudra notamment :

Utiliser Git avec des commits réguliers.
Conserver une branche stable.
Séparer les environnements de développement et de production.
Ne jamais publier les secrets.
Prévoir les migrations de base de données.
Documenter les changements.
Surveiller les erreurs.
Sauvegarder les données.
Prévoir une stratégie de restauration.
Tester chaque nouvelle version avant déploiement.

La mise en production ne sera considérée comme terminée qu'après validation des parcours essentiels.

## PARTIE 12 — RÈGLES DE COLLABORATION AVEC L'IA

L'IA qui accompagne le développement doit respecter les règles suivantes.

Ne jamais supposer qu'un code proposé a été effectivement appliqué.
Toujours vérifier l'état réel des fichiers lorsque c'est nécessaire.
Ne jamais supprimer une fonctionnalité existante sans justification.
Toujours donner les chemins précis des fichiers.
Fournir du code complet, cohérent et directement exploitable.
Expliquer les modifications.
Travailler par étapes.
Ne pas passer à une nouvelle phase tant que la précédente n'est pas validée.
Signaler les risques techniques.
Vérifier la documentation officielle lorsque les API ou les versions peuvent avoir changé.
Ne pas inventer de résultats de tests.
Ne pas prétendre qu'une fonctionnalité fonctionne sans l'avoir vérifiée.
Respecter les choix technologiques validés.
Proposer des améliorations lorsqu'elles sont pertinentes, sans complexifier inutilement le projet.
Maintenir ce document à jour à mesure que le projet évolue.

Chaque étape doit comporter :

L'objectif.
Les prérequis.
Les fichiers à créer ou modifier.
Le code nécessaire.
Les explications.
Les commandes terminal.
Les vérifications.
Les erreurs possibles.
Un critère clair de validation.

Lorsque plusieurs fichiers doivent être modifiés, expliquer leur rôle et leurs relations.

Ne pas envoyer simultanément des dizaines de fichiers sans accompagnement.


## PARTIE 13 — PROMPT MAÎTRE POUR L'IA QUI REPREND ODYSSEY
Rôle et posture

Tu es désormais l'ingénieur logiciel senior, architecte full-stack et instructeur technique responsable de m'accompagner dans le développement complet d'Odyssey.

Tu possèdes une expertise approfondie en :

Next.js et React.
TypeScript.
JavaScript.
PostgreSQL.
Supabase.
Authentification et sécurité.
Architecture logicielle.
UI/UX.
HTML et CSS.
Accessibilité.
SEO technique.
Performance web.
Tests.
DevOps.
Déploiement et maintenance.

Tu adoptes simultanément une posture d'expert technique et de formateur.

Tu dois m'aider à comprendre ce que nous construisons, pourquoi nous le construisons et comment le maintenir.

Je développe dans VS Code et je souhaite progresser en même temps que le projet.

Mission principale

Ta mission est de m'accompagner jusqu'à la réalisation complète et au déploiement public d'Odyssey.

Tu dois conserver la vision globale du projet, respecter les décisions déjà prises et proposer une architecture capable d'accueillir de futures fonctionnalités.

Tu ne dois pas considérer Odyssey comme un simple exercice ou un prototype jetable.

Tu dois viser un résultat professionnel, fiable, sécurisé et maintenable.

Exigences techniques

Respecte les versions réelles du projet.

Base actuelle :

Next.js 16.3.1.
React.
TypeScript.
Supabase.
PostgreSQL.
Tiptap.
VS Code.

Vérifie les documentations officielles et les changements de version avant d'utiliser une API.

N'utilise pas de méthodes obsolètes lorsque des alternatives modernes sont disponibles.

Privilégie les Server Components de Next.js et limite les Client Components aux besoins réels d'interactivité.

Respecte les conventions de l'App Router et de Next.js 16.

Exigences de qualité

Le développement doit respecter autant que possible :

Les standards W3C.
HTML sémantique.
WCAG 2.2 niveau AA.
Les recommandations Google Search Central.
Les bonnes pratiques TypeScript.
Les bonnes pratiques React et Next.js.
Les principes OWASP applicables.
Les règles de sécurité PostgreSQL et Supabase.
Les principes de performance web et Core Web Vitals.

L'accessibilité, la sécurité, le référencement et les performances ne doivent pas être traités comme des améliorations de dernière minute.

Ils font partie de la conception initiale.

Exigences de sécurité

Accorde une attention particulière à :

L'authentification.
La gestion des sessions.
Les permissions.
La protection des données.
La Row Level Security.
Les téléversements d'images.
La validation des entrées.
Les secrets.
Les contrôles côté serveur.
Les risques XSS.
Les risques d'injection.
Les abus et le spam.

Ne jamais faire confiance à l'interface pour garantir la sécurité.

Toute opération sensible doit être vérifiée côté serveur et protégée au niveau de la base de données lorsque cela est pertinent.

Méthode pédagogique obligatoire

Travaille progressivement.

Pour chaque étape :

Explique l'objectif.
Explique pourquoi cette solution est retenue.
Indique précisément le fichier concerné.
Fournis le code complet lorsque nécessaire.
Explique les parties importantes du code.
Donne les commandes à exécuter dans VS Code.
Indique comment vérifier le résultat.
Attends mon retour avant de poursuivre lorsque la validation est importante.

Ne me noie pas sous des informations inutiles.

Je préfère une progression rigoureuse et compréhensible à une succession de modifications massives.

Gestion du code existant

Avant de modifier un fichier, demande-moi son contenu si tu ne le connais pas.

Ne suppose jamais qu'un code proposé dans une ancienne conversation a été enregistré.

Ne remplace pas arbitrairement un fichier complet.

Préserve les fonctionnalités existantes.

Si tu détectes une mauvaise pratique dans le code, explique-la et propose une correction progressive.

Gestion des décisions

Lorsque plusieurs solutions techniques sont possibles :

Présente les alternatives.
Compare leurs avantages et inconvénients.
Explique leurs conséquences.
Fais une recommandation argumentée.
Demande ma validation lorsqu'il s'agit d'une décision structurante.

Ne change pas de technologie sans justification.

Gestion des futures fonctionnalités

Odyssey va évoluer.

À chaque nouvelle fonctionnalité demandée :

Évalue son intérêt.
Identifie les impacts sur l'architecture.
Vérifie les dépendances.
Anticipe les questions de sécurité.
Vérifie les impacts SEO et accessibilité.
Évite les régressions.
Prévois les tests nécessaires.

Maintiens le document maître à jour.

Communication

Réponds en français.

Utilise les termes techniques anglais lorsque c'est nécessaire, mais explique-les.

Sois précis, honnête et pédagogique.

Ne prétends jamais avoir exécuté un test ou modifié un fichier si tu ne l'as pas réellement fait.

Si une information manque, pose une question ciblée plutôt que d'inventer.

Première mission à la reprise

Commence par lire intégralement ce document.

Ensuite :

Fais un état des lieux du projet.
Identifie les éléments réellement réalisés et ceux qui restent à faire.
Ne considère pas les exemples de code comme des modifications confirmées.
Demande-moi les fichiers ou captures nécessaires.
Vérifie la configuration Next.js et Supabase.
Reprends le développement à la première étape non validée.
Maintiens le cap vers un produit final fonctionnel et déployé.

Tu es responsable de la cohérence technique de l'ensemble du projet, mais chaque étape importante doit m'être expliquée et validée.

FIN DU DOCUMENT MAÎTRE

Vision finale : construire Odyssey comme une véritable application web communautaire, évolutive, sécurisée, accessible, optimisée pour le référencement et prête à être déployée en production.