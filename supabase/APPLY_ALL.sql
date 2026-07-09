-- DBB: apply-everything script (paste into Supabase SQL Editor and Run)
-- Combines migrations 0001-0004 + product seed. Idempotent where possible.

-- ===== create storage bucket (replaces CLI step from 0002) =====
insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict (id) do nothing;

-- profiles: mirrors auth.users, adds role
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  category text not null check (category in ('hoodies','tees','headwear','accessories')),
  image_url text not null default '',
  featured boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- variants
create table if not exists public.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text,
  stock_qty integer not null default 0 check (stock_qty >= 0),
  sku text not null unique
);

create index if not exists variants_product_id_idx on public.variants(product_id);

-- updated_at bump trigger
create or replace function public.bump_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function public.bump_updated_at();

-- is_admin(): SECURITY DEFINER function to check role without triggering
-- RLS-policy self-recursion when used in policies on public.profiles itself
-- (a profiles policy that subqueries profiles causes Postgres error 42P17,
-- "infinite recursion detected in policy for relation profiles"). Also
-- centralizes the admin check for reuse across all admin policies.
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;

-- profiles: user reads own row; admins read all
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin());

-- products: public can read active products; admins can read/write everything
create policy "products_public_read_active" on public.products
  for select using (active = true);

create policy "products_admin_all" on public.products
  for all using (public.is_admin())
  with check (public.is_admin());

-- variants: same pattern, joined through product
create policy "variants_public_read_active_product" on public.variants
  for select using (
    exists (select 1 from public.products pr where pr.id = product_id and pr.active = true)
  );

create policy "variants_admin_all" on public.variants
  for all using (public.is_admin())
  with check (public.is_admin());

-- Run once via Supabase dashboard (Storage tab) or CLI before applying these policies:
--   supabase storage buckets create product-images --public
-- Bucket name: product-images, public = true (public read)

create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "product_images_admin_update"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_email text,
  stripe_session_id text unique,
  stripe_payment_intent text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  subtotal numeric(10,2) not null default 0,
  shipping_cost numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_stripe_session_id_idx on public.orders(stripe_session_id);

-- order_items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.variants(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- carts: one JSON snapshot row per logged-in user
create table if not exists public.carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- newsletter_subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

-- RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.carts enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- orders: users see their own; admins see all
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_select_admin" on public.orders
  for select using (public.is_admin());

create policy "orders_insert_own_or_guest" on public.orders
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "orders_update_admin" on public.orders
  for update using (public.is_admin());

-- order_items: readable if the parent order is readable
create policy "order_items_select_own_order" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "order_items_select_admin" on public.order_items
  for select using (public.is_admin());

-- No public/guest insert policy on order_items: the pending order + its line
-- items are written server-side via the service-role client in the checkout
-- API route. An unconditional guest-insert policy would let any anonymous
-- client append arbitrary rows (any product/price/quantity) to any guest
-- order whose id it learns (order ids leak via Stripe metadata/success URLs).

-- carts: only the owning user
create policy "carts_all_own" on public.carts
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- newsletter_subscribers: anyone can insert (subscribe), no public read policy defined (admin-only via service role if ever needed)
create policy "newsletter_insert_any" on public.newsletter_subscribers
  for insert with check (true);

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

-- ===== product seed =====
-- Seeds the 8 static products from src/lib/data/catalog.ts into real tables.
-- Run after 0001/0002 migrations. Image URLs kept as existing Unsplash URLs;
-- replace via the admin uploader once real product photos are ready.

with p1 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Mindset Heavyweight Hoodie', 'mindset-hoodie', 'A 450gsm heavyweight hoodie built to last. Boxy fit, dropped shoulders, embroidered DBB mark.', 120, 'hoodies', 'https://images.unsplash.com/photo-1499972777470-6a932ea55420?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'MINDSET-HOODIE-' || v.size
from p1, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p2 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('No Excuses Hoodie', 'no-excuses-hoodie', 'Premium fleece-lined hoodie with a bold back print. Your daily reminder.', 110, 'hoodies', 'https://images.unsplash.com/photo-1612978322313-be209301e185?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'NO-EXCUSES-HOODIE-' || v.size
from p2, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p3 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Built Different Tee', 'built-different-tee', 'Heavyweight cotton tee with a relaxed drape. Screen-printed graphic.', 48, 'tees', 'https://images.unsplash.com/photo-1564382225035-dbdf309682a6?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'BUILT-DIFFERENT-TEE-' || v.size
from p3, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p4 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('The Movement Tee', 'the-movement-tee', 'Garment-dyed essential tee. Soft hand-feel, structured collar.', 45, 'tees', 'https://images.unsplash.com/photo-1722310752951-4d459d28c678?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'THE-MOVEMENT-TEE-' || v.size
from p4, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p5 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Done Being Broke Tee', 'dbb-tee', 'The statement piece. Oversized fit with chest and sleeve hits.', 50, 'tees', 'https://images.unsplash.com/photo-1494578924983-b472e391e1fa?auto=format&fit=crop&w=800&h=1000&q=80', false, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'DBB-TEE-' || v.size
from p5, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p6 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('DBB Structured Cap', 'dbb-cap', '6-panel structured cap with raised embroidery and adjustable strap.', 38, 'headwear', 'https://images.unsplash.com/photo-1678951671924-bd2c022382b0?auto=format&fit=crop&w=800&h=1000&q=80', true, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'DBB-CAP-' || v.size
from p6, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p7 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Mindset Beanie', 'mindset-beanie', 'Ribbed cuffed beanie in heavyweight knit. One size.', 32, 'headwear', 'https://images.unsplash.com/photo-1606748294390-f6449e6c61ef?auto=format&fit=crop&w=800&h=1000&q=80', false, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'MINDSET-BEANIE-' || v.size
from p7, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);

with p8 as (
  insert into products (name, slug, description, price, category, image_url, featured, active)
  values ('Movement Tote', 'movement-tote', 'Heavy canvas tote with reinforced straps. Carry the mindset.', 28, 'accessories', 'https://images.unsplash.com/photo-1583911201080-eb7064a15428?auto=format&fit=crop&w=800&h=1000&q=80', false, true)
  returning id
)
insert into variants (product_id, size, color, stock_qty, sku)
select id, v.size, 'Black', v.stock_qty, 'MOVEMENT-TOTE-' || v.size
from p8, (values ('XS',0),('S',11),('M',10),('L',9),('XL',8),('XXL',7)) as v(size, stock_qty);
