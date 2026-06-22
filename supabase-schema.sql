-- ============================================================
-- DBB Store — Supabase Schema
-- Run this in the Supabase SQL editor after creating your project
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase Auth)
-- ============================================================
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text unique not null,
  full_name   text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- PRODUCTS
-- ============================================================
create table public.products (
  id            uuid default uuid_generate_v4() primary key,
  name          text not null,
  slug          text unique not null,
  description   text,
  price         numeric(10,2) not null,
  compare_price numeric(10,2),          -- for showing "was $X" strikethrough
  category      text not null check (category in ('hoodies', 'pants', 'tees', 'accessories')),
  image_url     text,                   -- main product image (Supabase Storage URL)
  images        text[] default '{}',    -- additional image URLs
  featured      boolean default false,
  active        boolean default true,   -- toggle visibility without deleting
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ============================================================
-- PRODUCT VARIANTS (size + color + stock)
-- ============================================================
create table public.variants (
  id          uuid default uuid_generate_v4() primary key,
  product_id  uuid references public.products on delete cascade not null,
  size        text not null,           -- XS, S, M, L, XL, XXL
  color       text,
  sku         text unique,
  stock_qty   integer not null default 0,
  created_at  timestamptz default now()
);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id                    uuid default uuid_generate_v4() primary key,
  user_id               uuid references public.profiles,
  guest_email           text,          -- for guest checkout
  stripe_payment_intent text unique,
  stripe_session_id     text unique,
  status                text not null default 'pending'
                          check (status in ('pending','paid','fulfilled','cancelled','refunded')),
  subtotal              numeric(10,2) not null,
  shipping_cost         numeric(10,2) default 0,
  total                 numeric(10,2) not null,
  shipping_address      jsonb,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table public.order_items (
  id          uuid default uuid_generate_v4() primary key,
  order_id    uuid references public.orders on delete cascade not null,
  variant_id  uuid references public.variants not null,
  product_id  uuid references public.products not null,
  quantity    integer not null,
  unit_price  numeric(10,2) not null,  -- price locked at time of purchase
  created_at  timestamptz default now()
);

-- ============================================================
-- SITE CONTENT (editable by admin — hero, sections, etc.)
-- ============================================================
create table public.site_content (
  key         text primary key,         -- e.g. 'hero_headline', 'hero_subtext', 'story_body'
  value       text,
  type        text default 'text' check (type in ('text', 'html', 'image_url', 'video_url')),
  label       text,                     -- human-readable label for admin panel
  updated_at  timestamptz default now()
);

-- Seed default content
insert into public.site_content (key, label, type, value) values
  ('hero_headline',      'Hero Headline',           'text',      'DONE BEING BROKE'),
  ('hero_subtext',       'Hero Subtext',             'text',      'Stop waiting. Start building.'),
  ('hero_cta_label',     'Hero Button Text',         'text',      'SHOP THE DROP'),
  ('hero_video_url',     'Hero Video URL',           'video_url', ''),
  ('brand_statement',    'Brand Statement',          'text',      'More than clothing. It''s a mindset.'),
  ('dbb_quote',          'DBB Quote',                'text',      'Everybody wants more. Few people are willing to become more.'),
  ('story_body',         'Our Story Text',           'html',      '<p>DBB was born from a feeling — the frustration of where you are versus where you know you can be...</p>'),
  ('cta_headline',       'Final CTA Headline',       'text',      'DONE BEING BROKE.'),
  ('cta_subtext',        'Final CTA Subtext',        'text',      'Stop waiting. Start building.'),
  ('cta_button_label',   'Final CTA Button Text',    'text',      'SHOP NOW'),
  ('instagram_url',      'Instagram URL',            'text',      'https://instagram.com/donebeingbroke'),
  ('tiktok_url',         'TikTok URL',               'text',      'https://tiktok.com/@donebeingbroke'),
  ('contact_email',      'Contact Email',            'text',      'contact@donebeingbroke.com');

-- ============================================================
-- COMMUNITY POSTS (customer photos/videos)
-- ============================================================
create table public.community_posts (
  id          uuid default uuid_generate_v4() primary key,
  media_url   text not null,
  media_type  text not null check (media_type in ('image', 'video')),
  caption     text,
  user_name   text,
  approved    boolean default false,   -- admin must approve before showing
  created_at  timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles         enable row level security;
alter table public.products         enable row level security;
alter table public.variants         enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.site_content     enable row level security;
alter table public.community_posts  enable row level security;

-- Profiles: users can read/update their own
create policy "profiles_self"   on public.profiles for all using (auth.uid() = id);
create policy "profiles_admin"  on public.profiles for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Products: everyone can read active products; only admins can write
create policy "products_public_read"  on public.products for select using (active = true);
create policy "products_admin_all"    on public.products for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Variants: everyone can read; only admins can write
create policy "variants_public_read" on public.variants for select using (true);
create policy "variants_admin_all"   on public.variants for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Orders: users can see their own orders; admins see all
create policy "orders_own"   on public.orders for all using (auth.uid() = user_id);
create policy "orders_admin" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Order items: same as orders
create policy "items_own"   on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
);
create policy "items_admin" on public.order_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Site content: public read; admin write
create policy "content_public_read" on public.site_content for select using (true);
create policy "content_admin_write" on public.site_content for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Community posts: public read approved; admin can write/approve
create policy "community_public_read" on public.community_posts for select using (approved = true);
create policy "community_admin_all"   on public.community_posts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via SQL)
-- ============================================================
-- Create these buckets in Supabase Storage:
--   "products"    — product images (public)
--   "community"   — community uploads (public)
--   "hero"        — hero/banner images and videos (public)
-- All set to public so URLs work in <img> and <video> tags
