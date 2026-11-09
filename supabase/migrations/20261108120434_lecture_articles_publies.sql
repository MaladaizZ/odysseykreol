-- Retirer les droits existants pour repartir sur des droits explicites.
revoke all on table public.articles from public, anon, authenticated;

-- Autoriser la lecture de la table.
grant select on table public.articles to anon, authenticated;

-- Limiter cette lecture aux articles publiés.
create policy "Lecture des articles publies"
on public.articles
for select
to anon, authenticated
using (status = 'published');