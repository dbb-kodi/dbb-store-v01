# DBB E-Commerce — What's Left To Do

This document tracks everything still needed to turn the current **frontend-only**
scaffold into a fully functional, production e-commerce store.

> **Current state:** All pages, components, admin UI, and the design system are built and
> deploy cleanly on Vercel. Everything below is **mocked or stubbed** — no real database,
> payments, auth, or email are wired up yet.

---

## 1. Branding & Assets (cosmetic — do anytime)

- [ ] Replace the placeholder **DBB logo** (currently text-only) with the real logo (navbar, footer, admin sidebar, auth pages, favicon).
- [ ] Swap the temporary **Unsplash product/hero/category photos** for real product photography.
- [ ] Add real product copy, prices, sizes, and SKUs.
- [ ] Add `favicon.ico`, social share / Open Graph images, and `metadata` per page.

---

## 2. Database & Backend (Supabase) — **foundation for everything else**

The Supabase clients exist (`src/lib/supabase/`) but currently return `null` until env vars are set.

- [ ] Create a Supabase project; set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Create tables: `products`, `variants`, `categories`, `orders`, `order_items`, `community_posts`, `content` (CMS), `newsletter_subscribers`, `profiles` (with `is_admin` flag).
- [ ] Enable **Row Level Security**: public read on products/content, admin-only writes, user-owns-their-orders.
- [ ] Set up **Supabase Storage** bucket for product/community images.
- [ ] Replace mock reads in `src/lib/data/catalog.ts` with live Supabase queries (keep the same return shapes so components don't change).

---

## 3. Admin — Inventory & Content Management

The admin pages exist but are **read-only and backed by mock data**. They need to write to Supabase.

- [ ] **Auth-gate `/admin`** — only logged-in admins can access (middleware + role check).
- [ ] **Products**: create / edit / delete products; edit name, price, description, category, `active`/`featured` flags.
- [ ] **Inventory**: edit per-variant `stock_qty`; show low-stock / sold-out badges from live data.
- [ ] **Images**: upload product & category images to Supabase Storage from the admin UI.
- [ ] **Content editor**: persist hero/story/ticker copy to the `content` table so the homepage reads from it.
- [ ] **Orders dashboard**: list orders, view details, update fulfillment status (the "Orders: —" stat is a placeholder).

---

## 4. Payments (Stripe) — partially built

`src/app/api/stripe/checkout/route.ts` already creates a real Checkout Session (returns 503 until keys are set).
`webhook/route.ts` verifies signatures but has a `TODO` for order fulfillment.

- [ ] Add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL` env vars.
- [ ] Validate cart **prices against the database** server-side before creating the session (never trust client prices).
- [ ] **Decrement inventory** and **create the order record** in the Stripe webhook on `checkout.session.completed`.
- [ ] Collect shipping address in Checkout (`shipping_address_collection`) and configure shipping rates / tax.
- [ ] Handle the `/checkout/success` page by looking up the real order via `session_id`.
- [ ] Register the webhook endpoint URL in the Stripe dashboard.

---

## 5. Authentication (Supabase Auth)

Login & signup pages are **static forms with no handlers**.

- [ ] Wire `/auth/login` and `/auth/signup` to Supabase Auth (email/password; optionally Google).
- [ ] Add password reset / email confirmation flow.
- [ ] Add a customer **account area**: profile, order history, addresses.
- [ ] Restore real **auth middleware** (currently a pass-through) to protect `/admin` and account routes.

---

## 6. Email & Notifications (Resend)

No emails are sent anywhere yet. `resend` is installed; env vars exist.

- [ ] Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- [ ] **Order confirmation** email to the customer after successful payment.
- [ ] **New-order notification** email to the admin.
- [ ] Wire the **Contact form** (`/contact`) to send an email (currently static, no submit handler).
- [ ] Build email templates (black/white branded).

---

## 7. Newsletter / Marketing

- [ ] Add a **newsletter signup** form (footer) that stores subscribers in Supabase.
- [ ] Send a confirmation / welcome email via Resend.
- [ ] Admin tool (or external service like Resend Audiences) to **send deal/newsletter blasts**.
- [ ] Add unsubscribe link + handling (legal requirement).

---

## 8. Storefront Functionality Gaps

- [ ] **Search** and **sort** on `/shop` (filter by category exists; add price/name sort + search box).
- [ ] **Inventory enforcement**: prevent adding more than `stock_qty` to cart; block sold-out variants.
- [ ] **Community page**: allow approved user submissions instead of static mock posts.
- [ ] Product reviews / ratings (optional).
- [ ] Discount / promo codes (can use Stripe Coupons).

---

## 9. Quality, SEO & Launch

- [ ] **Tests**: unit tests for the cart store and checkout payload; basic e2e for the buy flow.
- [ ] **SEO**: `sitemap.xml`, `robots.txt`, structured data (Product schema), per-page metadata.
- [ ] **Analytics**: add Vercel Analytics or GA4.
- [ ] **Accessibility** pass (focus states, alt text, color contrast already strong).
- [ ] **Legal pages**: Privacy Policy, Terms, Shipping & Returns.
- [ ] **Performance**: re-enable `next/image` optimization (`unoptimized: false`) once real images are hosted.
- [ ] **Error/monitoring**: Sentry or similar.

---

## Suggested Build Order

1. **Supabase setup** (Section 2) — unblocks everything.
2. **Admin write access** (Section 3) — so real products/inventory exist.
3. **Auth** (Section 5) — gate the admin and enable accounts.
4. **Payments end-to-end** (Section 4) — checkout → webhook → order record.
5. **Emails** (Section 6) — order confirmations + admin alerts.
6. **Newsletter** (Section 7), then **storefront gaps** (Section 8).
7. **Quality, SEO, legal, launch** (Section 9).
