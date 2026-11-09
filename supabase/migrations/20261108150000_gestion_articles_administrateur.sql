-- Ne pas ajouter ce nouveau schema aux schemas exposes par la Data API.
create schema private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

-- Lire le role actuel en base, sans dependre des claims d'un ancien JWT.
-- La fonction ne renvoie aucune donnee de compte, seulement un booleen.
create function private.est_administrateur()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as utilisateur
    where utilisateur.id = (select auth.uid())
      and utilisateur.raw_app_meta_data ->> 'role' = 'admin'
  );
$$;

revoke all on function private.est_administrateur() from public, anon, authenticated;
grant execute on function private.est_administrateur() to authenticated;

-- Les grants de colonnes et les politiques des auteurs restent inchanges.
create policy "Modification administrative des articles publies"
on public.articles
for update
to authenticated
using (
  status = 'published'
  and (select private.est_administrateur())
)
with check (
  status = 'published'
  and (select private.est_administrateur())
);

create policy "Suppression administrative des articles publies"
on public.articles
for delete
to authenticated
using (
  status = 'published'
  and (select private.est_administrateur())
);
