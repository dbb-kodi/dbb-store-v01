-- site_content: editable homepage/story copy (admin CMS)
create table if not exists public.site_content (
  key text primary key,
  value text,
  label text not null default '',
  type text not null default 'text',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at
  before update on public.site_content
  for each row execute function public.bump_updated_at();

-- community_posts: UGC grid (admin-approved)
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image','video')),
  caption text,
  user_name text,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.site_content enable row level security;
alter table public.community_posts enable row level security;

create policy "content_public_read" on public.site_content
  for select using (true);

create policy "content_admin_all" on public.site_content
  for all using (public.is_admin())
  with check (public.is_admin());

create policy "community_public_read_approved" on public.community_posts
  for select using (approved = true);

create policy "community_admin_all" on public.community_posts
  for all using (public.is_admin())
  with check (public.is_admin());

-- default content keys (idempotent; admin edits win on re-run)
insert into public.site_content (key, value, label, type) values
  ('hero_headline', 'MORE THAN CLOTHING.', 'Hero Headline', 'text'),
  ('hero_subtext', 'It''s a mindset. Built for the driven, the ambitious, the relentless.', 'Hero Subtext', 'text'),
  ('ticker_text', 'DONE BEING BROKE · DBB · THE MINDSET IS THE MOVEMENT · BUILT DIFFERENT · NO EXCUSES · STAY DANGEROUS', 'Ticker Text', 'text'),
  ('story_headline', 'THE STORY', 'Story Headline', 'text'),
  ('story_body', 'DBB was born from a simple but radical idea: that ambition is a lifestyle, not a moment. We were tired of seeing people settle — settle for less than they''re capable of, less than they deserve, less than they''re built for.

So we built a brand for the ones who decided enough was enough. The ones grinding before the sun comes up. The ones who see every setback as a setup. DBB is for the movers, the builders, the ones who choose growth every single day.

Every piece we release carries that energy. Heavyweight construction. Clean lines. No noise — just purpose.', 'Story Body', 'textarea'),
  ('message_quote', 'DONE BEING BROKE IS NOT ABOUT MONEY. IT''S ABOUT DECIDING YOU''LL NEVER SETTLE AGAIN.', 'Message Section Quote', 'textarea'),
  ('instagram_url', 'https://instagram.com/donebeingbroke', 'Instagram URL', 'text')
on conflict (key) do nothing;

-- seed community grid only when empty (mock lifestyle shots, replaced by real UGC later)
insert into public.community_posts (media_url, media_type, caption, user_name, approved)
select * from (values
  ('https://images.unsplash.com/photo-1546863929-b9c543a2aec7?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'Built different.', '@marcus', true),
  ('https://images.unsplash.com/photo-1719620293684-24c428bce8fb?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'No days off.', '@jdot', true),
  ('https://images.unsplash.com/photo-1612978322313-be209301e185?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'The mindset is the movement.', '@simone', true),
  ('https://images.unsplash.com/photo-1499972777470-6a932ea55420?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'Stay dangerous.', '@theo', true),
  ('https://images.unsplash.com/photo-1546863929-b9c543a2aec7?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'Built different.', '@marcus', true),
  ('https://images.unsplash.com/photo-1719620293684-24c428bce8fb?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'No days off.', '@jdot', true),
  ('https://images.unsplash.com/photo-1612978322313-be209301e185?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'The mindset is the movement.', '@simone', true),
  ('https://images.unsplash.com/photo-1499972777470-6a932ea55420?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'Stay dangerous.', '@theo', true),
  ('https://images.unsplash.com/photo-1546863929-b9c543a2aec7?auto=format&fit=crop&w=600&h=600&q=80', 'image', 'Built different.', '@marcus', true)
) as seed(media_url, media_type, caption, user_name, approved)
where not exists (select 1 from public.community_posts);
