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
