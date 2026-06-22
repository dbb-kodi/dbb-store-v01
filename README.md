# DBB Store — Done Being Broke
### Full-stack clothing e-commerce with admin dashboard

---

## Tech Stack
| Layer | Tool | Purpose |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Pages, SSR, routing |
| Styling | Tailwind CSS | Design system |
| Database | Supabase (PostgreSQL) | Products, orders, users, content |
| Auth | Supabase Auth | Customer login + admin role |
| Storage | Supabase Storage | Product images, hero video |
| Payments | Stripe Checkout | Secure payment processing |
| Email | Resend | Order confirmation emails |
| State | Zustand | Cart (persisted to localStorage) |
| Hosting | Vercel | Deploy with one command |

---

## Quick Start (30 minutes to live)

### 1. Create accounts (free tier, ~10 minutes)

| Service | URL | What you need |
|---|---|---|
| **Supabase** | supabase.com | Create a new project. Note your Project URL + anon key. |
| **Stripe** | stripe.com | Create account. Get publishable + secret keys from Developers tab. |
| **Resend** | resend.com | Create account. Get API key. Add/verify your sending domain. |
| **Vercel** | vercel.com | Connect your GitHub repo for easy deploys. |

> Email: Use one email to sign up for all of these. Gmail works fine.

---

### 2. Set up Supabase

1. Go to **SQL Editor** in your Supabase dashboard
2. Paste and run the entire contents of `supabase-schema.sql`
3. Go to **Storage** → create 3 buckets:
   - `products` (public)
   - `hero` (public)
   - `community` (public)
4. For each bucket: **Policies** → "Allow public access for SELECT"

---

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your keys from each service.

---

### 4. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

### 5. Create an admin user

1. Go to http://localhost:3000/auth/login → create an account
2. In Supabase dashboard → **Table Editor** → `profiles`
3. Find your user → change `role` from `customer` to `admin`
4. Now you can access http://localhost:3000/admin

---

### 6. Set up Stripe webhook (for order confirmation emails)

```bash
# Install Stripe CLI
npm install -g @stripe/stripe-cli

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret it shows you → add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

For production: Stripe Dashboard → Webhooks → Add endpoint
- URL: `https://yourdomain.com/api/stripe/webhook`
- Event: `checkout.session.completed`

---

### 7. Deploy to Vercel

```bash
npx vercel
```

Add all your `.env.local` variables in Vercel dashboard → Settings → Environment Variables.

---

## Admin Panel Features

| Section | Path | What you can do |
|---|---|---|
| Products | `/admin/products` | Add/edit products, **change prices** inline, show/hide items, view stock |
| Site Content | `/admin/content` | Edit hero text, video URL, quotes, social links |
| Orders | `/admin/orders` | View all orders, update fulfillment status |
| Community | `/admin/community` | Approve/reject customer photos |
| Customers | `/admin/customers` | View registered users |

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── layout.tsx            ← Root layout (Navbar + CartDrawer)
│   ├── shop/                 ← Product listing + product detail pages
│   ├── story/                ← Our Story page
│   ├── community/            ← Community page
│   ├── contact/              ← Contact page
│   ├── checkout/             ← Checkout + success/cancel pages
│   ├── auth/                 ← Login + signup
│   ├── admin/                ← Admin dashboard (role-protected)
│   └── api/
│       └── stripe/
│           ├── checkout/     ← Creates Stripe session
│           └── webhook/      ← Handles payment confirmation
├── components/
│   ├── layout/               ← Navbar, Footer, CartDrawer
│   ├── shop/                 ← Hero, CategoryGrid, ProductCards, etc.
│   └── admin/                ← AdminSidebar, ProductsTable, ContentEditor
├── lib/
│   ├── supabase/             ← Browser + server Supabase clients
│   └── store/                ← Zustand cart store
├── types/
│   └── database.ts           ← TypeScript types for all DB tables
└── styles/
    └── globals.css           ← Tailwind + custom CSS
```

---

## Adding a Product (via Admin Panel)

1. Go to `/admin/products`
2. Click **+ ADD PRODUCT**
3. Fill in: name, slug, price, category, description
4. Upload product image (goes to Supabase Storage → `products` bucket)
5. Add variants (sizes: XS, S, M, L, XL, XXL + stock quantities)
6. Toggle **Featured** to show it on the homepage
7. Toggle **Active** to make it live

---

## Design Tokens

| Token | Value | Use |
|---|---|---|
| `dbb-black` | `#0A0A0A` | Background |
| `dbb-charcoal` | `#2A2A2A` | Cards, panels |
| `dbb-cream` | `#F0EDE8` | Primary text |
| `dbb-acid` | `#C8FF00` | Accent, CTAs, prices |
| `dbb-ash` | `#8A8A8A` | Secondary text |
| Font display | Bebas Neue | Headlines |
| Font body | Inter | Body text |

---

## Still to build (next sessions)

- [ ] Shop page with category filter + search
- [ ] Individual product detail page (size selector, image gallery)
- [ ] Checkout page UI (before Stripe redirect)
- [ ] Order success/cancelled pages
- [ ] User account page (order history)
- [ ] Admin: product create/edit form with image upload
- [ ] Admin: orders table
- [ ] Admin: community post approval
- [ ] Our Story page
- [ ] Community page
- [ ] Contact page
- [ ] Supabase RPC `decrement_stock` function
- [ ] SEO meta tags per product
- [ ] Mobile responsiveness polish
