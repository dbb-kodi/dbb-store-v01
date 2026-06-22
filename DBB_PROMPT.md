# DBB E-Commerce Website — Build Prompt

Build a complete, production-ready e-commerce website for **DBB** (Done Being Broke) — a streetwear/lifestyle brand built around the mindset of ambition, self-improvement, and financial freedom.

---

## BRAND IDENTITY

- **Brand name:** DBB (Done Being Broke)
- **Tagline:** "More than clothing. It's a mindset."
- **Tone:** Premium streetwear — raw, aspirational, confident. Thinks Supreme meets Aime Leon Dore.
- **Target audience:** Young adults 18–35 who are driven, style-conscious, and growth-oriented.

---

## TECH STACK

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS only — no component libraries
- **State:** Zustand (cart store)
- **Backend:** Supabase (auth, database, storage)
- **Payments:** Stripe Checkout
- **Email:** Resend
- **Deployment:** Vercel

---

## COLOR PALETTE & DESIGN SYSTEM

Strictly enforce this palette — no warm tones, no accent colors:

| Token | Value |
|---|---|
| Background | `#000000` (pure black) |
| Surface / cards | `#111111` |
| Elevated surface | `#1A1A1A` |
| Border / dividers | `#2A2A2A` |
| Muted text | `#666666` |
| Secondary text | `#999999` |
| Primary text | `#FFFFFF` |
| Headings | `#FFFFFF` |
| Hover / interactive | `#FFFFFF` with opacity transitions |

**Typography:**
- Display / headings: `Bebas Neue` or `Anton` from Google Fonts — wide, bold, all caps
- Body: `Inter` — clean, modern, highly readable
- Letter spacing on headings: very wide (`0.15em+`)
- No decorative or script fonts

**Design feel:**
- Editorial, grid-based, lots of negative space
- Minimal borders — use spacing to define sections, not boxes
- Subtle hover transitions (opacity, scale, underline) — nothing flashy
- No gradients, no shadows, no glow effects
- Inspired by: Aime Leon Dore, Noah NYC, Our Legacy webshops

---

## PLACEHOLDER IMAGES

Since no real product photography is available yet, use placeholder images throughout:

- Use `https://placehold.co/{width}x{height}/111111/ffffff?text=DBB` for all product images
- Hero background: solid black with text overlay
- Category images: rectangular `placehold.co` placeholders
- Community/lifestyle grid: square `placehold.co` placeholders
- All `<img>` tags must have descriptive `alt` text
- When Supabase storage is connected later, swap these by updating the database

---

## PAGES TO BUILD

### 1. Homepage (`/`)
- Full-screen hero: large bold headline **"DONE BEING BROKE"**, subtext tagline, single CTA button **"SHOP NOW"** — white text on solid black background
- Ticker / marquee: scrolling text strip — `DONE BEING BROKE · BUILT DIFFERENT · NO EXCUSES · THE MINDSET IS THE MOVEMENT`
- Category grid: 4 categories (Hoodies, Tees, Headwear, Accessories) with placeholder images and hover overlay
- Featured Products: 4-product grid — placeholder images, product name, price
- Brand statement section: large centered quote, minimal, full-width dark background
- Community UGC grid: 3×3 placeholder image grid with "Tag us @donebeingbroke" caption
- Final CTA: full-width black section, big headline, single button
- Footer

### 2. Shop (`/shop`)
- Header: "ALL PRODUCTS" headline + item count
- Filter bar: category tabs (All / Hoodies / Tees / Headwear / Accessories) — client-side filtering
- Product grid: 4 columns desktop, 2 mobile
- Each card: placeholder image (3:4 ratio), product name, price, "Add to Cart" on hover
- Empty state: clean centered message when no products

### 3. Product Detail (`/shop/[slug]`)
- Large product image (left, placeholder) + info panel (right)
- Product name, price in large type
- Size selector: button grid (XS S M L XL XXL) — clear selected state
- Color selector if applicable
- "Add to Cart" button — full width, prominent
- Product description
- Related products strip at bottom (4 cards)

### 4. Cart Drawer (slide-in from right)
- Overlay backdrop
- Cart item list: placeholder thumbnail, name, size, price, quantity controls, remove button
- Subtotal at bottom
- "Checkout" button
- "Continue Shopping" link

### 5. Checkout (`/checkout`)
- Calls `/api/stripe/checkout` and redirects to Stripe Checkout
- Success page (`/checkout/success`): order confirmed message, order ID
- Cancelled page (`/checkout/cancelled`): link back to shop

### 6. Our Story (`/story`)
- Full-width editorial layout
- Large heading, body copy about brand origin and mindset
- Pull quote with left white border
- CTA to shop

### 7. Community (`/community`)
- Heading + description
- 3-column grid of placeholder lifestyle images
- "Tag us @donebeingbroke to be featured" CTA

### 8. Contact (`/contact`)
- Simple centered form: Name, Email, Message, Submit
- Wire to Resend when backend is ready

### 9. Auth (`/auth/login`, `/auth/signup`)
- Minimal centered layout, DBB logo mark at top
- Email + password fields, clean understated styling

### 10. Admin (`/admin`) — Protected
- Supabase auth + `role = 'admin'` check
- Sidebar: Dashboard, Products, Content, Orders
- Dashboard: stat cards (products, orders, revenue)
- Products page: table with name, price, stock, active toggle, edit
- Content page: editable fields for homepage text

---

## COMPONENTS TO BUILD

**Layout:** Navbar (fixed, logo left, links center, cart icon right with badge), Footer, CartDrawer

**Shop:** ProductCard, ProductGrid, SizeSelector, AddToCartButton, CategoryFilter, FeaturedProducts, CommunitySection, HeroSection, TickerTape, FinalCTA, MessageSection, CategoryGrid

**Admin:** AdminSidebar, ProductsTable (inline price edit, active toggle), ContentEditor

---

## DATABASE SCHEMA (Supabase)

```sql
profiles      (id, role, full_name, avatar_url, created_at)
products      (id, name, slug, description, price, category, image_url, featured, active, created_at)
variants      (id, product_id, size, color, stock_qty, sku)
orders        (id, user_id, guest_email, stripe_session_id, stripe_payment_intent, status, subtotal, shipping_cost, total, shipping_address, created_at)
order_items   (id, order_id, variant_id, product_id, quantity, unit_price)
site_content  (id, key, value, label, type, updated_at)
community_posts (id, user_id, media_url, media_type, caption, approved, created_at)
```

RLS policies: users read active products + their own orders; admins read/write everything.

---

## API ROUTES

- `POST /api/stripe/checkout` — verifies stock/prices server-side, creates Stripe Checkout session
- `POST /api/stripe/webhook` — handles `checkout.session.completed`: creates order, decrements stock, sends Resend confirmation email

---

## FRONTEND-FIRST DEPLOYMENT STRATEGY

The site **must build and deploy on Vercel with zero environment variables set**. Achieve this by:

- All Supabase data-fetching wrapped in `try/catch` returning `[]` or `{}` on failure
- API routes depending on Stripe/Supabase return a `503` JSON response if env vars are missing
- **No TypeScript `Database` generics on the Supabase client** — use untyped clients so queries return `any` instead of `never` when no DB is connected
- Middleware must be a simple pass-through (no `supabase.auth.getUser()`) until Supabase is configured
- Every page renders correctly with empty data — never crash on missing content

---

## ENVIRONMENT VARIABLES

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

---

## QUALITY BAR

- Every page fully responsive (mobile-first)
- No hydration errors, no TypeScript build errors
- Lighthouse performance > 90 on desktop
- Use `next/image` where possible
- All interactive elements have hover/focus states
- Cart persists via localStorage (Zustand persist middleware)
