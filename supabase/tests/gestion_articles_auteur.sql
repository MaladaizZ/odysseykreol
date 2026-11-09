-- Test d'integration RLS : aucune donnee ne doit persister.
-- Executer seulement sur odyssey-kreyol-dev apres la migration de gestion.
-- Le compte du lanceur doit pouvoir SET ROLE et preparer les deux lignes.
-- Aucun compte auth.users n'est cree. Aucun article existant n'est modifie.
begin;

set local statement_timeout = '15s';
set local lock_timeout = '3s';

do $preparation$
declare
  auteur uuid;
  autre_membre uuid := gen_random_uuid();
  article_publie uuid := gen_random_uuid();
  article_brouillon uuid := gen_random_uuid();
  document_test jsonb := jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object(
        'type', 'paragraph',
        'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', 'Texte temporaire du test RLS.')
        )
      )
    )
  );
begin
  -- La cle etrangere exige un auteur existant, conserve uniquement en variable.
  select author_id into auteur
  from public.articles
  where author_id is not null
  order by created_at, id
  limit 1;

  if auteur is null then
    raise exception 'Test non execute : aucun article ne permet de choisir un auteur existant.';
  end if;

  while autre_membre = auteur loop
    autre_membre := gen_random_uuid();
  end loop;

  perform set_config('odyssey_test.auteur', auteur::text, true);
  perform set_config('odyssey_test.autre_membre', autre_membre::text, true);
  perform set_config('odyssey_test.article_publie', article_publie::text, true);
  perform set_config('odyssey_test.article_brouillon', article_brouillon::text, true);

  -- Seules ces deux nouvelles lignes seront visees par les assertions suivantes.
  insert into public.articles (
    id, author_id, title, slug, excerpt, content, status, published_at
  ) values (
    article_publie,
    auteur,
    'Test RLS temporaire publie',
    'test-gestion-auteur-' || article_publie::text,
    'Resume temporaire du test RLS.',
    document_test,
    'published',
    now()
  ), (
    article_brouillon,
    auteur,
    'Test RLS temporaire brouillon',
    'test-gestion-auteur-' || article_brouillon::text,
    'Resume temporaire du test RLS.',
    document_test,
    'draft',
    null
  );

  perform set_config(
    'request.jwt.claims',
    jsonb_build_object('sub', auteur::text, 'role', 'authenticated')::text,
    true
  );
  perform set_config('request.jwt.claim.sub', auteur::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
end;
$preparation$;

set local role authenticated;

do $auteur$
declare
  lignes integer;
begin
  if auth.uid() is distinct from current_setting('odyssey_test.auteur')::uuid then
    raise exception 'Le contexte de test auteur est incorrect.';
  end if;

  if (
    select count(*) from public.articles
    where id = current_setting('odyssey_test.article_brouillon')::uuid
  ) <> 1 then
    raise exception 'L''auteur doit pouvoir lire son brouillon.';
  end if;

  update public.articles
  set title = 'Titre temporaire modifie',
      excerpt = 'Resume temporaire modifie.',
      content = jsonb_build_object(
        'type', 'doc',
        'content', jsonb_build_array(
          jsonb_build_object(
            'type', 'paragraph',
            'content', jsonb_build_array(
              jsonb_build_object('type', 'text', 'text', 'Contenu temporaire modifie.')
            )
          )
        )
      )
  where id = current_setting('odyssey_test.article_publie')::uuid;
  get diagnostics lignes = row_count;
  if lignes <> 1 then
    raise exception 'L''auteur doit pouvoir modifier les trois champs editoriaux.';
  end if;

  begin
    -- Meme reecrire le meme auteur doit etre interdit par le grant de colonnes.
    update public.articles
    set author_id = author_id
    where id = current_setting('odyssey_test.article_publie')::uuid;
    raise exception 'La colonne author_id ne doit pas etre modifiable.';
  exception when insufficient_privilege then
    null;
  end;

  begin
    update public.articles
    set slug = slug || '-interdit'
    where id = current_setting('odyssey_test.article_publie')::uuid;
    raise exception 'La colonne slug ne doit pas etre modifiable.';
  exception when insufficient_privilege then
    null;
  end;
end;
$auteur$;

do $autre_membre$
declare
  lignes integer;
begin
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object(
      'sub', current_setting('odyssey_test.autre_membre'),
      'role', 'authenticated'
    )::text,
    true
  );
  perform set_config('request.jwt.claim.sub', current_setting('odyssey_test.autre_membre'), true);

  if auth.uid() is distinct from current_setting('odyssey_test.autre_membre')::uuid then
    raise exception 'Le contexte de test autre membre est incorrect.';
  end if;

  if (
    select count(*) from public.articles
    where id = current_setting('odyssey_test.article_brouillon')::uuid
  ) <> 0 then
    raise exception 'Un autre membre ne doit pas pouvoir lire le brouillon.';
  end if;

  update public.articles
  set title = 'Modification interdite'
  where id = current_setting('odyssey_test.article_publie')::uuid;
  get diagnostics lignes = row_count;
  if lignes <> 0 then
    raise exception 'Un autre membre ne doit pas pouvoir modifier cet article.';
  end if;

  delete from public.articles
  where id = current_setting('odyssey_test.article_publie')::uuid;
  get diagnostics lignes = row_count;
  if lignes <> 0 then
    raise exception 'Un autre membre ne doit pas pouvoir supprimer cet article.';
  end if;
end;
$autre_membre$;

set local role anon;

do $anonyme$
begin
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claim.role', 'anon', true);

  if auth.uid() is not null then
    raise exception 'Le contexte de test anonyme est incorrect.';
  end if;

  if (
    select count(*) from public.articles
    where id = current_setting('odyssey_test.article_publie')::uuid
  ) <> 1 then
    raise exception 'La lecture publique des articles publies doit rester possible.';
  end if;

  if (
    select count(*) from public.articles
    where id = current_setting('odyssey_test.article_brouillon')::uuid
  ) <> 0 then
    raise exception 'Un visiteur ne doit pas pouvoir lire le brouillon.';
  end if;

  begin
    update public.articles
    set title = 'Modification anonyme interdite'
    where id = current_setting('odyssey_test.article_publie')::uuid;
    raise exception 'Un visiteur ne doit avoir aucun droit UPDATE.';
  exception when insufficient_privilege then
    null;
  end;

  begin
    delete from public.articles
    where id = current_setting('odyssey_test.article_publie')::uuid;
    raise exception 'Un visiteur ne doit avoir aucun droit DELETE.';
  exception when insufficient_privilege then
    null;
  end;
end;
$anonyme$;

set local role authenticated;

do $suppression_auteur$
declare
  lignes integer;
begin
  perform set_config(
    'request.jwt.claims',
    jsonb_build_object(
      'sub', current_setting('odyssey_test.auteur'),
      'role', 'authenticated'
    )::text,
    true
  );
  perform set_config('request.jwt.claim.sub', current_setting('odyssey_test.auteur'), true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);

  delete from public.articles
  where id = current_setting('odyssey_test.article_publie')::uuid;
  get diagnostics lignes = row_count;
  if lignes <> 1 then
    raise exception 'L''auteur doit pouvoir supprimer son article publie.';
  end if;

  delete from public.articles
  where id = current_setting('odyssey_test.article_brouillon')::uuid;
  get diagnostics lignes = row_count;
  if lignes <> 1 then
    raise exception 'L''auteur doit pouvoir supprimer son brouillon.';
  end if;
end;
$suppression_auteur$;

reset role;
rollback;

do $resultat$
begin
  raise notice 'Tests RLS reussis : transaction annulee, aucune donnee de test conservee.';
end;
$resultat$;

select 'Tests RLS reussis ; ROLLBACK execute.' as resultat;
