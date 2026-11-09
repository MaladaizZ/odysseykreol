-- Autoriser les membres connectes a publier leurs propres articles.
grant insert on table public.articles to authenticated;

create policy "Insertion de ses propres articles publies"
on public.articles
for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and status = 'published'
);
