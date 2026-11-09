# Attribuer le premier rôle administrateur

Le rôle d'administration de l'application est enregistré dans `app_metadata.role`, avec la valeur exacte `admin`.

Ce guide ne choisit aucun compte. Aucun compte n'a été promu et aucun SQL n'a été exécuté pour préparer ce document. L'attribution décrite ci-dessous est une opération manuelle à réaliser uniquement pour le compte que tu choisis toi-même.

L'attribution du rôle ne nécessite aucune migration. Elle ouvre la page `/admin` et son lien de navigation.

Après application de la migration `20261108150000_gestion_articles_administrateur.sql`, ce rôle permet aussi de modifier le titre, le résumé et le contenu, ou de supprimer après confirmation, les articles publiés des autres membres. Le slug et l'auteur ne sont pas modifiables. Les droits des auteurs sur leurs propres articles sont conservés ; aucun état « masqué » n'est ajouté.

Chaque page et chaque action administrative vérifie le rôle côté serveur. Supabase le relit également dans les métadonnées protégées du compte pour les modifications et suppressions d'articles publiés. Cette vérification en base ne dépend pas d'un ancien rôle conservé dans le JWT.

Quand la clé privée du serveur est configurée, ce rôle ouvre aussi `/admin/membres` : liste des comptes, changement d'e-mail ou de mot de passe et suppression définitive après confirmation. Après la migration `20261109120000_conservation_articles_suppression_compte.sql`, les articles d'un compte supprimé sont conservés et leur `author_id` devient `NULL`. L'administrateur ne peut pas se supprimer lui-même depuis cette interface. Voir le [guide de gestion des membres](gestion-membres.md).

## 1. Choisir et vérifier le compte

1. Connecte-toi au Dashboard Supabase et ouvre le projet **`odyssey-kreyol-dev`**.
2. Vérifie sa référence : **`drkzswotjuyuxgnwhglm`**.
3. Dans **Authentication > Users**, choisis toi-même le compte concerné.
4. Vérifie son adresse e-mail et assure-toi que cette adresse est confirmée.
5. Copie l'UUID de ce compte. Ne le confonds pas avec son adresse e-mail.

Les exemples suivants contiennent `REMPLACER_PAR_UUID_DU_COMPTE_CHOISI`. Ce texte n'est pas un UUID valide : PostgreSQL refusera la requête si tu oublies de le remplacer.

## 2. Attribuer le rôle manuellement

Dans le SQL Editor du même projet, prépare cette requête en remplaçant uniquement le texte indicatif par l'UUID du compte choisi et vérifié :

```sql
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin')
where id = 'REMPLACER_PAR_UUID_DU_COMPTE_CHOISI'::uuid
  and email_confirmed_at is not null
returning
  id,
  email,
  raw_app_meta_data ->> 'role' as role_application;
```

Avant de l'exécuter, vérifie encore le projet et l'UUID sélectionnés.

- `coalesce` utilise un objet JSON vide si les métadonnées sont absentes.
- `|| jsonb_build_object(...)` ajoute ou remplace seulement la clé `role` et conserve les autres clés existantes.
- La condition sur `email_confirmed_at` exige un compte dont l'adresse e-mail est confirmée.
- `returning` permet de contrôler le compte ciblé et le rôle obtenu.

Considère l'attribution comme réussie uniquement si la requête retourne **exactement une ligne**, avec l'UUID et l'adresse e-mail du compte choisi, et `role_application` égal à `admin`.

Si elle retourne **zéro ligne**, l'attribution n'a pas été effectuée. Vérifie le projet, l'UUID, l'existence du compte et la confirmation de son adresse e-mail. Ne retire pas la condition de confirmation pour contourner ce résultat.

Ne modifie jamais `auth.users.role` pour cette opération : ce champ est distinct du rôle personnalisé de l'application. N'utilise pas non plus `user_metadata` ou `raw_user_meta_data` pour accorder un accès administrateur.

## 3. Vérifier l'accès dans l'application

1. Déconnecte-toi de l'application, puis reconnecte-toi avec le compte choisi.
2. Rafraîchis la page pour actualiser la navigation.
3. Vérifie la présence du lien d'administration et ouvre `/admin`.

L'application doit vérifier ce rôle côté serveur. Afficher ou masquer le lien de navigation ne suffit pas à protéger la page.

Un membre ordinaire ne peut pas modifier son propre `app_metadata` via l'API utilisateur. Supabase distingue cette donnée d'autorisation de `user_metadata`, qui est modifiable par le membre. Voir la [documentation Supabase sur les métadonnées et les règles RLS](https://supabase.com/docs/guides/database/postgres/row-level-security#authjwt).

Le contrôle serveur utilise `getUser()` pour récupérer les informations du compte directement auprès du serveur Auth. Cette méthode récupère le dossier utilisateur actuel ; les claims d'un ancien JWT peuvent conserver une ancienne valeur jusqu'au renouvellement du jeton. Voir les [méthodes d'authentification côté serveur](https://supabase.com/docs/guides/auth/server-side/creating-a-client#choosing-an-auth-method) et la [référence de `getUser()`](https://supabase.com/docs/reference/javascript/auth-getuser).

## 4. Retirer le rôle

Pour retirer cet accès, utilise le **même UUID**, dans le SQL Editor du **même projet** :

```sql
update auth.users
set raw_app_meta_data =
  coalesce(raw_app_meta_data, '{}'::jsonb) - 'role'
where id = 'REMPLACER_PAR_UUID_DU_COMPTE_CHOISI'::uuid
returning
  id,
  email,
  raw_app_meta_data ->> 'role' as role_application;
```

Cette requête retire uniquement la clé `role`. Elle conserve les autres métadonnées et ne supprime pas le compte.

Vérifie qu'elle retourne exactement une ligne pour le compte choisi et que `role_application` vaut `NULL`, ce qui indique ici que la clé a été retirée. Zéro ligne ne constitue pas une révocation réussie.

Déconnecte-toi ensuite de l'application, reconnecte-toi et rafraîchis `/admin`. Le lien d'administration doit disparaître et l'accès à la page doit être refusé. Les droits ordinaires du membre sur ses propres articles restent inchangés.
