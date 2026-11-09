# Gestion des membres

Cette étape ajoute la liste des comptes, la modification de leur e-mail ou mot de passe et leur suppression définitive dans `/admin/membres`. Elle ne permet pas de modifier les rôles.

## Accès et droits

Chaque page et chaque action vérifie la session côté serveur avec `getUser()`, puis exige la valeur exacte `app_metadata.role === "admin"`. Un visiteur est redirigé vers `/connexion` ; un membre ordinaire ne peut pas ouvrir les pages. Le lien du menu ne remplace pas ces contrôles. Voir la [référence de getUser](https://supabase.com/docs/reference/javascript/auth-getuser).

Le client Auth Admin utilise une clé secrète qui contourne les règles RLS. Il n’est créé qu’après le contrôle administrateur, reste côté serveur, ne reçoit pas les cookies du membre et ne conserve pas de session. Ses requêtes utilisent `cache: "no-store"`. Ce client ne doit jamais être transmis à un composant client. Voir les [clés Supabase](https://supabase.com/docs/guides/getting-started/api-keys) et le [client Auth Admin](https://supabase.com/docs/reference/javascript/admin-api).

L’administrateur peut modifier les identifiants de connexion et supprimer les autres comptes, y compris d’autres administrateurs. L’auto-suppression est interdite côté page et action, avec comparaison des UUID normalisés et de l’identifiant retourné par Auth. Aucun compte n’est choisi ou promu par cette fonctionnalité ; l’attribution initiale reste décrite dans [premier-administrateur.md](premier-administrateur.md).

## Configuration et mise en service

La présence de `SUPABASE_SECRET_KEY` dans `.env.local` a été confirmée. Sa valeur n’a été ni affichée ni copiée et aucun appel Auth Admin n’a été effectué pour la tester. Pour un nouvel environnement, définir dans `.env.local` en local ou dans les secrets de l’hébergement :

```dotenv
SUPABASE_SECRET_KEY=REMPLACER_PAR_LA_CLE_SECRETE_SERVEUR
```

Le client utilise aussi l’URL existante `NEXT_PUBLIC_SUPABASE_URL`. La clé et l’URL doivent appartenir au même projet. La clé moderne commence par `sb_secret_`; `SUPABASE_SERVICE_ROLE_KEY` est accepté comme solution de repli pour une ancienne clé. Ne jamais utiliser de préfixe `NEXT_PUBLIC_` pour cette clé, la commiter, la coller dans un message ou remplacer la clé publique du navigateur. Redémarrer le serveur de développement ou redéployer après modification des variables.

La migration suivante a été appliquée le 9 novembre 2026 au projet **odyssey-kreyol-dev** (`drkzswotjuyuxgnwhglm`), après vérification du projet lié et de la liste des migrations en attente :

```text
supabase/migrations/20261109120000_conservation_articles_suppression_compte.sql
```

Cette migration rend `articles.author_id` nullable et remplace la clé étrangère initiale par `ON DELETE SET NULL`. Elle ne supprime aucun compte ni article existant. La lecture du catalogue après application a confirmé cette contrainte, les sept règles RLS existantes et le nombre inchangé d’articles. Pour un autre environnement, vérifier son identité et les migrations en attente avant tout déploiement. En local, ouvrir `/admin/membres` avec un compte administrateur déjà autorisé.

## Modifier un compte

La liste est paginée par groupes de 20 comptes. Le formulaire permet de changer l’e-mail et de saisir un nouveau mot de passe facultatif. Les actions contrôlent l’UUID et relisent le compte avec `getUserById()` avant toute modification.

- L’e-mail est validé côté serveur ; une adresse déjà utilisée est refusée par Auth.
- Un mot de passe vide conserve le mot de passe actuel : l’attribut `password` est omis.
- Un nouveau mot de passe doit contenir entre 12 et 128 caractères et ne pas être composé uniquement d’espaces. Il n’est pas nettoyé silencieusement. Les exigences supplémentaires du projet Auth restent applicables.
- Le mot de passe ne fait jamais partie de l’état renvoyé au navigateur, des valeurs préremplies ou des journaux. Les erreurs des actions ne journalisent pas les requêtes Auth brutes.

Seuls les attributs réellement modifiés sont transmis. `updateUserById()` applique directement les changements administratifs, sans parcours de confirmation par e-mail. Le code n’ajoute pas `email_confirm: true` : modifier une adresse ne doit pas être présenté comme une preuve de possession de la nouvelle boîte. Les sessions déjà ouvertes du membre peuvent devoir être renouvelées ; un changement de mot de passe peut imposer une reconnexion. Voir la [modification Auth Admin](https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid) et les [sessions Auth](https://supabase.com/docs/guides/auth/sessions).

## Supprimer un compte en conservant ses articles

Ouvrir la page de confirmation ne supprime rien. Elle affiche le compte et le nombre d’articles associés, tous statuts confondus. L’action exige également la case de confirmation côté serveur.

La seule opération de suppression est `auth.admin.deleteUser(id, false)` : `false` demande une suppression définitive du compte Auth. Aucune dissociation manuelle des articles et aucune suppression d’article ne la précèdent. La clé étrangère met `author_id` à `NULL` dans la transaction de suppression ; si celle-ci échoue, la dissociation est annulée avec elle. Voir la [référence deleteUser](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser).

Tous les articles sont conservés avec leurs titres, résumés, contenus, slugs et statuts. Un article publié conserve son URL et reste public. Un brouillon reste privé et conservé, mais devient sans auteur ; l’administration actuelle ne gère que les articles publiés et ne propose pas sa réattribution.

Des fichiers Storage appartenant au compte peuvent bloquer la suppression. Aucun fichier n’est supprimé ou réattribué automatiquement pour contourner ce refus. Les jetons de renouvellement du compte supprimé sont invalidés, mais un JWT déjà émis peut rester valable jusqu’à son expiration : ne pas promettre une déconnexion immédiate de toutes les requêtes. Voir les [limites de suppression des utilisateurs](https://supabase.com/docs/guides/auth/managing-user-data#deleting-users).

## Conservation des données et état observé

L’audit en lecture communiqué le 9 novembre 2026 relevait 5 articles : 4 publiés et 1 brouillon ; aucun `author_id` nul ; aucun bucket ni objet Storage ; aucune entrée dans `auth.audit_log_entries`. Ce relevé est un instantané, pas une garantie pour les suppressions futures.

La seule table applicative relevée dans les schémas `public` et `private` était `public.articles`, sans déclencheur personnalisé sur `auth.users`. Les relations natives Auth, notamment identités et sessions, comportent des suppressions en cascade ; certaines relations SCIM utilisent `SET NULL`. `auth.flow_state` et `auth.refresh_tokens` comportent un `user_id` sans clé étrangère : leur traitement ne peut pas être déduit des seules FK et reste confié à l’API Auth, sans nettoyage manuel ajouté.

La suppression du compte n’est pas une garantie d’anonymisation totale. Les textes, titres, résumés et slugs conservés peuvent identifier l’ancien membre. Des traces antérieures peuvent aussi subsister dans les journaux externes, les sauvegardes et chez les fournisseurs d’identité. Une table d’audit SQL vide ne prouve pas l’absence de journaux ailleurs. Voir les [journaux Auth](https://supabase.com/docs/guides/auth/audit-logs) et les [sauvegardes](https://supabase.com/docs/guides/platform/backups).

## Fichiers concernés

| Fichier | Rôle |
| --- | --- |
| `src/lib/session.ts` | Vérifier l’utilisateur et le rôle administrateur côté serveur. |
| `src/lib/supabase/admin.ts` | Créer le client privilégié avec une clé serveur et sans session. |
| `src/lib/membres.ts` | Valider l’UUID, l’e-mail et le nouveau mot de passe. |
| `app/admin/membres/page.tsx` | Afficher la liste paginée et les liens de gestion. |
| `app/admin/membres/[id]/modifier/page.tsx` | Charger le compte et présenter le formulaire. |
| `app/admin/membres/[id]/supprimer/page.tsx` | Présenter le compte, le nombre d’articles et la confirmation. |
| `app/admin/membres/actions.ts` | Contrôler les droits avant les opérations Auth Admin. |
| `components/formulaire-membre.tsx` | Saisir l’e-mail et le mot de passe facultatif. |
| `components/confirmation-suppression-membre.tsx` | Demander une confirmation explicite. |
| `supabase/migrations/20261109120000_conservation_articles_suppression_compte.sql` | Conserver les articles en détachant leur référence auteur lors de la suppression Auth. |

Pour cette implémentation, aucun compte ni article existant n’a été modifié ou supprimé, et aucun test n’a été exécuté.
