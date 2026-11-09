-- Permettre a un membre de lire aussi ses propres brouillons.
create policy "Lecture de ses propres articles"
on public.articles
for select
to authenticated
using (author_id = (select auth.uid()));

-- Limiter les modifications aux champs editoriaux.
grant update (title, excerpt, content)
on table public.articles
to authenticated;

grant delete on table public.articles to authenticated;

create policy "Modification de ses propres articles"
on public.articles
for update
to authenticated
using (author_id = (select auth.uid()))
with check (author_id = (select auth.uid()));

create policy "Suppression de ses propres articles"
on public.articles
for delete
to authenticated
using (author_id = (select auth.uid()));
