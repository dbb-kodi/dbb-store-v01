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
