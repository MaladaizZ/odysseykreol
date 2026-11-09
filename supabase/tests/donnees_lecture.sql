insert into public.articles (
  author_id,
  title,
  slug,
  excerpt,
  content,
  status,
  published_at
)
select
  auteur.id,
  test.title,
  test.slug,
  'Article créé pour tester la lecture.',
  jsonb_build_object(
    'type', 'doc',
    'content', jsonb_build_array(
      jsonb_build_object('type', 'paragraph')
    )
  ),
  test.status,
  case
    when test.status = 'published' then now()
    else null
  end
from (
  select id
  from auth.users
  where email_confirmed_at is not null
  order by created_at
  limit 1
) as auteur
cross join (
  values
    ('Test article publié', 'test-rls-publie', 'published'),
    ('Test article brouillon', 'test-rls-brouillon', 'draft')
) as test(title, slug, status)
returning slug, status;