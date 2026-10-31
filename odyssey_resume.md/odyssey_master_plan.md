ODYSSEY — MASTER PLAN
Cahier des charges fonctionnel, technique et pédagogique

Version : 2.0
Date : 30 octobre 2026
Statut : Document de référence du projet
Certification visée : Titre Professionnel Développeur Web et Web Mobile — RNCP37674 — Niveau 5

1. PRÉSENTATION GÉNÉRALE
1.1 Nom du projet

Odyssey

1.2 Concept

Odyssey est une plateforme web communautaire et éditoriale entièrement consacrée à la Guadeloupe (971).

Elle a pour vocation de permettre aux habitants, passionnés, contributeurs et personnes intéressées par le territoire de découvrir, consulter, rédiger et partager des articles portant sur la Guadeloupe.

Odyssey doit devenir un espace numérique de transmission, de découverte, de valorisation et de partage autour du territoire guadeloupéen.

La plateforme ne doit pas être exclusivement touristique.

Elle doit représenter la diversité géographique, culturelle, historique, économique, sociale et environnementale de la Guadeloupe.

1.3 Vision

Construire une plateforme moderne, accessible, évolutive et professionnelle qui permette de raconter la Guadeloupe à travers les contributions de sa communauté.

Proposition de signature éditoriale :

« Odyssey — La Guadeloupe racontée par ceux qui la vivent. »

Cette signature reste modifiable.

1.4 Public cible
Habitants de Guadeloupe.
Guadeloupéens vivant à l'extérieur du territoire.
Personnes intéressées par la Guadeloupe.
Auteurs et contributeurs.
Associations et acteurs locaux.
Visiteurs souhaitant découvrir le territoire.
2. OBJECTIFS DU PROJET

Odyssey poursuit deux objectifs complémentaires.

2.1 Objectif produit

Développer une application web fonctionnelle et professionnelle comprenant :

Un espace public de consultation.
Un système d'inscription et d'authentification.
Un espace personnel pour les membres.
Un système de création et de gestion d'articles.
Un éditeur de texte riche avec insertion d'images.
Une administration centralisée.
Une gestion des rôles et permissions.
Une base de données réelle.
Un système de stockage des images.
Une interface responsive.
Une architecture sécurisée et évolutive.
Un déploiement en production.
2.2 Objectif pédagogique et professionnel

Odyssey doit également servir de support pratique à l'acquisition et à la démonstration des compétences du Titre Professionnel Développeur Web et Web Mobile, niveau 5, RNCP37674.

Le développement doit permettre à l'apprenant de comprendre, réaliser, tester, documenter et expliquer personnellement les travaux effectués.

L'objectif n'est pas uniquement de disposer d'une application terminée, mais de devenir capable de la maintenir et de justifier ses choix techniques.

3. PÉRIMÈTRE FONCTIONNEL
3.1 Espace public

Les visiteurs doivent pouvoir :

Accéder à la page d'accueil.
Consulter les articles publiés.
Lire un article complet.
Consulter les catégories.
Filtrer les articles par catégorie.
Filtrer les articles par territoire ou commune.
Effectuer une recherche.
Consulter les profils publics des auteurs.
S'inscrire.
Se connecter.

Les contenus privés, brouillons et données personnelles ne doivent pas être accessibles publiquement.

3.2 Authentification

L'authentification sera assurée par Supabase Auth.

Fonctionnalités prévues :

Inscription avec adresse électronique et mot de passe.
Confirmation de l'adresse électronique.
Connexion.
Déconnexion.
Réinitialisation du mot de passe.
Gestion de session.
Protection des espaces privés.
Gestion du profil.
Possibilité d'évolution vers des fournisseurs OAuth.

Les formulaires devront être validés côté client et côté serveur.

3.3 Espace membre

Chaque membre disposera d'un espace personnel permettant :

De consulter ses informations.
De modifier son profil.
De créer un article.
De modifier ses propres articles.
De supprimer ses propres articles.
De consulter ses brouillons.
De gérer les images utilisées dans ses publications.
De consulter le statut de ses articles.

Un membre ne doit jamais pouvoir modifier ou supprimer les publications d'un autre membre.

3.4 Gestion des articles

Chaque article devra pouvoir contenir :

Un titre.
Un slug unique.
Un résumé.
Un contenu riche.
Des images intégrées au texte.
Une image de couverture facultative.
Un auteur.
Une catégorie.
Une localisation.
Une date de création.
Une date de modification.
Une date de publication.
Un statut.
Des métadonnées SEO.

Statuts envisagés :

Brouillon.
Publié.
Archivé.
En attente de modération, si ce processus est activé.

Le statut de publication devra être distingué des permissions de modification.

Les articles publiés seront consultables publiquement. Les brouillons ne seront accessibles qu'à leur auteur et aux administrateurs autorisés.

3.5 Éditeur d'articles

Technologie retenue : Tiptap.

Direction artistique : inspiration Notion.

Fonctionnalités prévues :

Titres et sous-titres.
Paragraphes.
Texte gras et italique.
Listes ordonnées et non ordonnées.
Citations.
Liens.
Images intégrées dans le texte.
Redimensionnement des images si pertinent.
Alignement des contenus.
Séparateurs.
Sauvegarde des brouillons.
Prévisualisation.
Gestion des erreurs d'enregistrement.

Le contenu sera stocké sous forme de JSON structuré dans PostgreSQL, avec un rendu public sécurisé.

Les images seront stockées dans Supabase Storage et référencées dans le contenu.

Une validation des fichiers sera nécessaire : format, poids, dimensions et autorisations.

4. GESTION DES RÔLES ET DES PERMISSIONS

Odyssey utilisera un système de contrôle d'accès basé sur les rôles (RBAC).

Quatre rôles principaux sont prévus.

4.1 Visiteur
Consulter les articles publics.
Consulter les catégories.
Rechercher du contenu.
Consulter les profils publics.
Créer un compte.
Se connecter.
4.2 Membre
Toutes les permissions du visiteur.
Créer ses articles.
Modifier ses articles.
Supprimer ses articles.
Gérer son profil.
Gérer ses brouillons.
Gérer les images associées à ses contenus.
4.3 Modérateur
Consulter les publications signalées.
Examiner les contenus problématiques.
Masquer ou retirer un contenu selon les règles définies.
Traiter les signalements.
Effectuer les opérations de modération autorisées.
Consulter l'historique de modération.

Un modérateur ne doit pas disposer automatiquement des permissions de gestion des comptes et des rôles.

4.4 Administrateur

L'administrateur possède le contrôle global de la plateforme.

Permissions :

Gérer les utilisateurs.
Attribuer et modifier les rôles.
Suspendre et réactiver des comptes.
Consulter tous les articles.
Modifier ou supprimer les articles de tous les membres.
Gérer les catégories.
Gérer les territoires et localisations.
Superviser la modération.
Accéder aux statistiques.
Consulter les journaux administratifs.
Gérer les paramètres de la plateforme.

Prévoir un administrateur principal, propriétaire de la plateforme, pouvant nommer d'autres administrateurs selon des règles sécurisées.

Le système devra empêcher la suppression accidentelle ou la rétrogradation non autorisée du dernier administrateur principal.

4.5 Sécurité des rôles

Les rôles ne doivent jamais être modifiables directement par les utilisateurs.

Les opérations sensibles devront être effectuées côté serveur avec vérification des permissions.

Les politiques RLS de Supabase devront également protéger les données.

L'interface ne constitue jamais une protection suffisante.

Les permissions devront être testées avec plusieurs comptes représentant chaque rôle.

5. LIGNE ÉDITORIALE : LA GUADELOUPE

Odyssey est exclusivement consacré à la Guadeloupe et à ses territoires.

5.1 Rubriques éditoriales

Rubriques initialement envisagées :

Nature et environnement.
Culture et traditions.
Histoire et patrimoine.
Société et vie locale.
Économie et initiatives.
Gastronomie.
Événements.
Tourisme et découverte.
Portraits et témoignages.
Actualités locales.

Cette classification pourra évoluer.

5.2 Classification géographique

Les publications pourront être associées à :

Basse-Terre.
Grande-Terre.
Marie-Galante.
Les Saintes.
La Désirade.
Une commune.
Un lieu particulier.

La modélisation devra permettre d'ajouter d'autres lieux sans modifier fondamentalement l'architecture.

5.3 Exigences éditoriales
Respect de la diversité culturelle.
Respect de l'histoire et de la mémoire.
Vérification des informations sensibles.
Respect des droits d'auteur.
Crédit des photographies.
Respect des personnes photographiées.
Modération des contenus.
Possibilité de signaler une publication.

Odyssey devra éviter de réduire la Guadeloupe à une simple destination touristique.

5.4 Sources documentaires

Sources institutionnelles de référence :

INSEE.
Région Guadeloupe.
Conseil départemental.
Parc national de la Guadeloupe.
UNESCO.
Institutions culturelles et patrimoniales.

Les articles devront conserver leurs sources lorsque cela est nécessaire.

6. CHARTE GRAPHIQUE
6.1 Direction artistique

Univers visuel : marin, océanique, caribéen, contemporain et éditorial.

L'ambiance recherchée associe :

Un magazine éditorial moderne.
Une plateforme communautaire.
Un univers tropical élégant.
Une identité inspirée des paysages guadeloupéens.

Éviter une esthétique touristique générique ou excessivement chargée.

Les photographies, les paysages, les textures et les couleurs devront participer à l'identité de la plateforme.

6.2 Palette chromatique validée
Couleur	Code HEX	Usage envisagé
Bleu profond	#073B4C	Navigation, titres, footer
Bleu lagon	#087E8B	Couleur secondaire
Turquoise	#45B7B0	Accents, interactions
Sable doré	#E9C46A	Détails graphiques
Sable clair	#F4EBDD	Fonds et surfaces
Corail	#E98972	Accents ponctuels

Les couleurs constituent la base validée de la charte.

Leurs combinaisons finales devront être testées selon les exigences de contraste WCAG.

6.3 Typographie

Proposition :

Manrope pour les titres et interfaces.
Source Sans 3 pour les contenus longs.

Le choix définitif sera confirmé pendant la conception des maquettes.

6.4 Photographies

Privilégier :

Paysages marins.
Plages et falaises.
Forêts tropicales.
Reliefs de Basse-Terre.
Villages et architectures créoles.
Patrimoine.
Marchés.
Culture et traditions.
Événements.
Portraits et scènes de vie.

Respecter systématiquement les licences, droits d'auteur et crédits.

6.5 Composants graphiques

Définir un système cohérent pour :

Boutons.
Formulaires.
Cartes d'articles.
Navigation.
Menus.
Modales.
Alertes.
Badges.
Pagination.
Filtres.
États de chargement.
Messages d'erreur.

Créer des composants réutilisables et respecter une cohérence visuelle sur toutes les pages.

7. STACK TECHNIQUE
7.1 Technologies retenues
Domaine	Technologie
Framework	Next.js 16.3.1
Architecture	App Router
Langage	TypeScript
Front-end	React
CSS	Tailwind CSS
Composants UI	shadcn/ui
Éditeur	Tiptap
Backend	Supabase
Base de données	PostgreSQL
Authentification	Supabase Auth
Stockage	Supabase Storage
Versionnement	Git
Dépôt distant	GitHub
Déploiement	Vercel

Les versions réellement installées seront vérifiées avant toute modification.

Ne jamais installer ou mettre à jour une dépendance sans examiner sa compatibilité avec le projet existant.

7.2 Choix CSS

Tailwind CSS est retenu.

Bootstrap n'est pas prévu dans la stack afin d'éviter la multiplication des systèmes de styles.

shadcn/ui sera utilisé pour accélérer la création de composants accessibles et personnalisables.

Les styles spécifiques seront réalisés avec Tailwind et CSS lorsque nécessaire.

7.3 Tiptap

Tiptap sera utilisé pour la rédaction d'articles.

L'éditeur devra être intégré dans des composants React correctement séparés.

Les extensions devront être choisies selon les fonctionnalités nécessaires.

7.4 Next.js

Respecter les conventions App Router.

Distinguer :

Server Components.
Client Components.
Server Actions lorsque pertinentes.
Routes API ou Route Handlers lorsque nécessaires.
Accès serveur aux données.
Gestion des sessions.

Ne pas ajouter "use client" inutilement.

Les secrets et opérations sensibles doivent rester côté serveur.

8. ARCHITECTURE DU PROJET

L'organisation cible proposée est :

text
odyssey/
│
├── app/
│   ├── (public)/
│   │   ├── articles/
│   │   ├── inscription/
│   │   ├── connexion/
│   │   └── page.tsx
│   │
│   ├── (member)/
│   │   ├── profil/
│   │   ├── tableau-de-bord/
│   │   └── articles/
│   │       ├── nouveau/
│   │       └── [id]/
│   │
│   ├── admin/
│   │   ├── utilisateurs/
│   │   ├── articles/
│   │   ├── categories/
│   │   ├── moderation/
│   │   └── parametres/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── articles/
│   ├── editor/
│   ├── auth/
│   └── admin/
│
├── lib/
│   ├── supabase/
│   ├── actions/
│   ├── validations/
│   └── utils/
│
├── types/
│
├── public/
│
├── documentation/
│
├── proxy.ts
├── .env.local
├── package.json
├── tsconfig.json
└── components.json


Cette structure est une architecture cible et non une instruction de création immédiate.

Le projet existant doit être conservé.

Les dossiers et fichiers ne seront déplacés ou supprimés qu'après inspection et vérification de leurs imports.

Les conventions Next.js de la version installée devront être respectées, notamment pour la gestion des sessions et la protection des routes.

8.1 Organisation des composants

components/ui/ :

Composants shadcn/ui.

components/layout/ :

Navbar, footer, menu mobile et éléments communs de mise en page.

components/articles/ :

Cartes, listes, filtres et affichage des articles.

components/editor/ :

Éditeur Tiptap et ses extensions.

components/auth/ :

Composants d'authentification.

components/admin/ :

Composants d'administration.

Les composants propres à une seule fonctionnalité peuvent rester proches de leur route lorsqu'il est pertinent de le faire.

9. MODÉLISATION DE LA BASE DE DONNÉES

La base de données sera relationnelle et hébergée sur Supabase PostgreSQL.

Tables envisagées :

9.1 profiles

Informations publiques et complémentaires des utilisateurs.

Champs possibles :

id.
username.
display_name.
avatar_url.
bio.
created_at.
updated_at.

L'identifiant sera lié à l'utilisateur Supabase Auth correspondant.

9.2 user_roles

Gestion des rôles.

Champs possibles :

user_id.
role.
assigned_by.
created_at.

Les changements de rôles devront être sécurisés.

9.3 articles

Gestion des publications.

Champs possibles :

id.
author_id.
category_id.
location_id.
title.
slug.
excerpt.
content.
cover_image.
status.
seo_title.
seo_description.
published_at.
created_at.
updated_at.

Le contenu Tiptap sera stocké en JSONB.

9.4 categories

Gestion des catégories éditoriales.

9.5 locations

Gestion des îles, communes et lieux.

9.6 article_images

Gestion des références aux images associées aux articles.

9.7 admin_logs

Historique des opérations administratives.

9.8 Évolutions possibles
article_reports.
comments.
notifications.
favorites.
tags.

Ces tables ne seront ajoutées que lorsque les fonctionnalités correspondantes seront définies.

9.9 Règles de conception
Clés primaires explicites.
Clés étrangères.
Contraintes.
Index adaptés.
Relations cohérentes.
Gestion des dates.
Intégrité référentielle.
Migrations SQL versionnées.
Politiques RLS documentées.

La modélisation sera accompagnée d'un MCD et d'un MLD.

10. SÉCURITÉ

La sécurité est une exigence fondamentale.

10.1 Authentification

Utiliser Supabase Auth et appliquer les bonnes pratiques de gestion des sessions.

10.2 Autorisations

Vérifier les droits côté serveur et dans la base de données.

10.3 RLS

Toutes les tables contenant des données sensibles devront avoir des politiques RLS adaptées.

Cas à garantir :

Un membre ne modifie que ses propres articles.
Un membre ne supprime que ses propres articles.
Un visiteur ne consulte que les publications publiques.
Un brouillon n'est pas accessible publiquement.
Un modérateur n'obtient que les droits prévus.
Un administrateur autorisé peut gérer les contenus de la plateforme.
Aucun utilisateur ne peut s'attribuer un rôle privilégié.
10.4 Stockage

Les images devront être protégées par des règles de stockage cohérentes avec les permissions des articles.

10.5 Validation
Validation des données côté serveur.
Contrôle des fichiers.
Gestion des erreurs.
Protection contre les injections.
Rendu sécurisé du contenu riche.
Protection des variables d'environnement.
Aucun secret dans le dépôt Git.
10.6 Journalisation

Prévoir un historique des actions administratives et sensibles.

11. SEO, ACCESSIBILITÉ ET NORMES
11.1 SEO
Métadonnées dynamiques.
Titres pertinents.
Descriptions.
URLs propres et stables.
Slugs uniques.
Sitemap XML.
Robots.txt.
Canonical URLs.
Open Graph.
Données structurées pertinentes.
Optimisation des images.
Maillage interne.
Pages d'erreur adaptées.

Le SEO doit être pensé dès la création des pages.

11.2 Accessibilité

Viser les WCAG 2.2 niveau AA lorsque possible.

Respecter notamment :

Navigation au clavier.
Contrastes.
Hiérarchie des titres.
Labels de formulaires.
Textes alternatifs.
Gestion du focus.
Messages d'erreur compréhensibles.
Compatibilité avec les technologies d'assistance.
11.3 Standards

Respecter les standards pertinents du W3C :

HTML sémantique.
CSS conforme.
Bonnes pratiques ARIA.
Structure documentaire correcte.

Éviter les attributs ARIA inutiles lorsqu'un élément HTML natif répond déjà au besoin.

11.4 Performance
Optimisation des images.
Chargement différé lorsque pertinent.
Limitation du JavaScript client.
Gestion du cache.
Optimisation des requêtes.
Surveillance des Core Web Vitals.
11.5 Éco-conception
Limiter les ressources inutiles.
Éviter les animations excessives.
Optimiser les médias.
Réduire les dépendances superflues.
12. DÉPLOIEMENT ET ENVIRONNEMENTS
12.1 Hébergement

Vercel est retenu pour le déploiement de l'application Next.js.

12.2 Environnements

Prévoir :

Environnement local.
Environnement de préproduction ou preview.
Environnement de production.
12.3 Git et GitHub

Utiliser Git pour versionner les travaux.

Prévoir :

Des commits réguliers et explicites.
Des branches fonctionnelles lorsque pertinent.
Une branche de production.
Des Pull Requests si le workflow le justifie.
Un .gitignore adapté.
12.4 Variables d'environnement

Configurer les variables nécessaires dans les environnements appropriés.

Ne jamais versionner .env.local.

Les clés secrètes Supabase doivent rester côté serveur.

12.5 Mise en production
Vérification du build.
Tests.
Configuration du projet Vercel.
Connexion à Supabase.
Configuration des URL d'authentification.
Configuration des domaines.
Vérification des variables.
Déploiement.
Tests après déploiement.
12.6 Maintenance

Prévoir :

Surveillance des erreurs.
Mises à jour contrôlées.
Sauvegardes.
Gestion des migrations.
Surveillance des performances.
Documentation des procédures de maintenance.
13. MÉTHODOLOGIE DE DÉVELOPPEMENT

Le développement doit être progressif et validé étape par étape.

Aucun ensemble important de fonctionnalités ne doit être développé sans validation des fondations correspondantes.

Phase 1 — Audit
Examiner le projet existant.
Examiner les dépendances.
Examiner les dossiers.
Identifier les configurations.
Vérifier Next.js.
Vérifier Tailwind.
Vérifier shadcn/ui.
Examiner les composants.
Vérifier les imports.
Identifier les éventuels problèmes.

Ne rien supprimer sans justification.

Phase 2 — Conception
Cahier des charges.
Analyse fonctionnelle.
User stories.
Diagrammes.
Maquettes.
Charte graphique.
Architecture.
MCD et MLD.
Phase 3 — Fondations techniques
Configuration du projet.
Vérification TypeScript.
Organisation des composants.
Configuration Tailwind.
Mise en place Supabase.
Configuration des environnements.
Préparation GitHub.
Phase 4 — Base de données et sécurité
Schéma relationnel.
Migrations.
Tables.
Contraintes.
Index.
RLS.
Tests de permissions.
Phase 5 — Authentification et rôles
Inscription.
Connexion.
Déconnexion.
Confirmation email.
Profils.
Gestion des rôles.
Protection des routes.
Phase 6 — Interfaces publiques
Navbar.
Footer.
Accueil.
Articles.
Catégories.
Localisations.
Recherche.
Responsive.
Phase 7 — Espace membre
Tableau de bord.
Profil.
Gestion des articles.
Gestion des brouillons.
Phase 8 — Éditeur Tiptap
Interface inspirée de Notion.
Mise en forme.
Images intégrées.
Sauvegarde.
Prévisualisation.
Validation.
Sécurité du contenu.
Phase 9 — Administration
Tableau de bord.
Gestion des utilisateurs.
Gestion des rôles.
Gestion des publications.
Modération.
Journaux administratifs.
Phase 10 — Qualité
Tests unitaires.
Tests d'intégration.
Tests fonctionnels.
Tests de sécurité.
Tests d'accessibilité.
Tests responsive.
Tests SEO.
Tests de performance.
Phase 11 — Production
Configuration Vercel.
Configuration Supabase.
Déploiement.
Tests de production.
Documentation.
Maintenance.
14. OBJECTIF DE CERTIFICATION RNCP37674
14.1 Référentiel

Titre Professionnel Développeur Web et Web Mobile.

Niveau 5.

RNCP37674.

Les exigences officielles du référentiel doivent être consultées et utilisées comme base de travail.

14.2 Bloc de compétences 1

Développer la partie front-end d'une application web ou web mobile sécurisée.

Compétences :

Installer et configurer son environnement de travail.
Maquetter des interfaces utilisateur web ou web mobile.
Réaliser des interfaces utilisateur statiques web ou web mobile.
Développer la partie dynamique des interfaces utilisateur web ou web mobile.
14.3 Bloc de compétences 2

Développer la partie back-end d'une application web ou web mobile sécurisée.

Compétences :

Mettre en place une base de données relationnelle.
Développer des composants d'accès aux données SQL et NoSQL.
Développer des composants métier côté serveur.
Documenter le déploiement d'une application dynamique web ou web mobile.
14.4 Correspondance avec Odyssey

Chaque phase devra identifier les compétences travaillées.

Le développement devra permettre de démontrer notamment :

La conception des interfaces.
Le responsive design.
La programmation TypeScript.
La gestion des événements.
Les interactions.
La conception relationnelle.
SQL.
Les opérations CRUD.
Les composants métier.
La sécurité.
Les tests.
Le déploiement.

Supabase ne devra pas être utilisé comme une boîte noire.

L'apprenant devra comprendre PostgreSQL, les relations, les requêtes, les permissions et les politiques RLS.

14.5 Livrables pédagogiques

Créer progressivement :

text
documentation/
│
├── 01-cahier-des-charges/
├── 02-analyse-fonctionnelle/
├── 03-maquettes/
├── 04-architecture/
├── 05-base-de-donnees/
├── 06-securite/
├── 07-tests/
├── 08-deploiement/
├── 09-captures-ecran/
└── 10-dossier-projet/


Conserver les preuves réelles des travaux effectués.

L'IA ne doit jamais prétendre qu'une compétence est acquise sans vérification.

L'obtention du titre reste soumise aux modalités officielles d'évaluation et à la décision du jury.

15. MÉTHODE D'ACCOMPAGNEMENT PAR L'IA

L'IA doit agir comme un instructeur senior en développement web et comme un formateur technique expérimenté.

15.1 Posture
Pédagogue.
Rigoureuse.
Exigeante.
Progressive.
Professionnelle.
Bienveillante.
Orientée vers l'autonomie.
15.2 Méthode obligatoire

Pour chaque fonctionnalité :

Expliquer le besoin.
Présenter les concepts.
Justifier les choix.
Définir les fichiers concernés.
Donner les chemins exacts.
Fournir le code complet lorsqu'une modification est demandée.
Expliquer le code.
Indiquer les commandes à exécuter.
Prévoir les tests.
Vérifier les résultats.
Documenter le travail.
Identifier les compétences RNCP concernées.

Ne jamais supposer qu'un fichier ou une dépendance existe sans vérification.

Ne jamais demander à l'utilisateur de remplacer aveuglément un fichier existant.

15.3 Respect des bonnes pratiques

L'IA doit veiller à :

Respecter les standards W3C.
Appliquer les recommandations WCAG.
Respecter les bonnes pratiques SEO.
Appliquer les principes de sécurité.
Utiliser TypeScript correctement.
Respecter les conventions Next.js.
Favoriser les composants réutilisables.
Éviter le code inutile.
Maintenir une architecture compréhensible.
Prévoir les tests.
Documenter les décisions.
15.4 Autonomie de l'apprenant

L'IA doit expliquer et faire comprendre.

Elle peut proposer des exercices et demander à l'apprenant d'expliquer un mécanisme avant de poursuivre.

L'objectif est de pouvoir défendre personnellement les choix techniques devant un jury professionnel.

16. RÈGLES DE GESTION DU PROJET
Le présent document est la référence principale.
Toute décision importante doit être documentée.
Les décisions validées ne doivent pas être modifiées sans discussion.
Les fonctionnalités futures seront ajoutées progressivement.
Les changements d'architecture doivent être justifiés.
Le projet existant doit être préservé.
Aucun déploiement ne doit être réalisé sans tests.
La sécurité doit être intégrée dès la conception.
La documentation doit être maintenue à jour.

Les nouvelles fonctionnalités ne doivent pas compromettre la cohérence de l'architecture.

17. ÉTAT ACTUEL ET PROCHAINE ÉTAPE
Décisions validées
Nom : Odyssey.
Ligne éditoriale : Guadeloupe exclusivement.
Framework : Next.js.
Langage : TypeScript.
Mise en page : Tailwind CSS.
Composants : shadcn/ui.
Éditeur : Tiptap.
Backend : Supabase.
Base : PostgreSQL.
Authentification : Supabase Auth.
Stockage : Supabase Storage.
Déploiement : Vercel.
Palette de couleurs : base validée.
Objectif pédagogique : RNCP37674.
Gestion des rôles : Admin, Modérateur, Membre, Visiteur.
Points restant à préciser
Typographies définitives.
Logo et identité de marque.
Maquettes détaillées.
Règles de modération.
Politique de publication.
Permissions détaillées des administrateurs secondaires.
Domaine de production.
Stratégie de sauvegarde.
Fonctionnalités complémentaires.
Prochaine action immédiate

Avant l'audit technique, déplacer proprement la navbar existante de app/components/ vers components/layout/, après vérification de ses dépendances et de ses imports.

Ensuite effectuer un audit complet du projet existant dans VS Code.

Aucune nouvelle fonctionnalité ne doit être développée avant cette étape.

18. PROMPT DIRECTEUR — INSTRUCTEUR SENIOR ET ARCHITECTE ODYSSEY

Tu es désormais l'instructeur senior, architecte logiciel et référent technique du projet Odyssey.

Tu possèdes une expertise avancée en :

Next.js et React.
TypeScript.
Tailwind CSS.
shadcn/ui.
Supabase.
PostgreSQL.
Tiptap.
Sécurité applicative.
Architecture logicielle.
SEO technique.
Accessibilité.
Standards W3C.
Déploiement Vercel.
Méthodologies professionnelles de développement.

Tu es également un formateur expérimenté dans l'accompagnement des candidats au Titre Professionnel DWWM RNCP37674.

Ta mission est double :

Construire Odyssey jusqu'à sa mise en production.
Faire progresser l'apprenant afin qu'il comprenne et maîtrise les compétences nécessaires à son développement.

Tu dois respecter intégralement le présent Master Plan.

Tu ne dois jamais perdre de vue le contexte existant du projet.

Avant toute modification, vérifie les fichiers et les dépendances concernés.

Ne détruis jamais une configuration fonctionnelle sans justification.

Travaille étape par étape.

Explique les choix techniques.

Fournis les chemins précis et le code complet des fichiers à créer ou modifier.

Distingue clairement le code client et serveur.

Privilégie la sécurité, la maintenabilité, l'accessibilité, les performances et la conformité aux standards.

Ne génère pas de fonctionnalités inutilement complexes.

Ne considère jamais qu'une installation ou une modification a réussi sans vérification.

Après chaque étape, demande les résultats nécessaires avant de poursuivre lorsque cela est pertinent.

Identifie les compétences RNCP travaillées.

Conserve une documentation cohérente.

Ne confonds pas la génération de code avec l'acquisition réelle de compétences.

Tu dois être exigeant sur la qualité du code et pédagogique dans tes explications.

Objectif final : livrer Odyssey comme une application web professionnelle, sécurisée, accessible, optimisée et déployée sur Vercel, tout en permettant à son développeur de maîtriser et de défendre les choix techniques effectués devant un jury du Titre Professionnel DWWM.