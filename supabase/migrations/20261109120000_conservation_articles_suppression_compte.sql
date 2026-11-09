-- Conserver tous les articles lors de la suppression definitive d'un compte Auth.
-- Seule la reference a l'ancien auteur devient NULL ; aucun article n'est supprime.
alter table public.articles
  alter column author_id drop not null,
  drop constraint articles_author_id_fkey,
  add constraint articles_author_id_fkey
    foreign key (author_id)
    references auth.users(id)
    on delete set null;
