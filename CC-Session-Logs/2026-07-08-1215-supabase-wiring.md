---
type: session-log
wing: dbb
date: 2026-07-08
topic: supabase-wiring
---

## Quick Reference

### Decisions
- Advisor + subagent tactic is now ALWAYS-ON for every task (user rejected scoped/conditional version twice) — codified in repo CLAUDE.md + persistent memory.
- Live data reads go through `src/lib/data/queries.ts` (Supabase first, mock catalog fallback) — pages never crash on empty/unconfigured DB.
- Middleware only gates "logged in or not" for `/admin` + `/account`; the admin role check stays in `admin/layout.tsx` via `requireAdmin()`.
- Schema applied via single paste-file `supabase/APPLY_ALL.sql` (combines migrations 0001–0004 + product seed) since no CLI token/DB password available locally.
- Admin promotion done directly via service-role REST PATCH instead of asking user to run SQL.

### Key Learnings
- `.env` had the Supabase **dashboard URL** instead of the API URL (`https://cnmlzhefradznbodikwa.supabase.co`) — root cause of DB never being reached. Always sanity-check env URLs against actual REST responses.
- Two Next servers on one `.next` folder = broken site: stale `npm run start` kept serving old asset hashes after a fresh `npm run build`, so all CSS/JS 404'd and pages rendered unstyled. Kill port 3000 before rebuild/restart. (Now in CLAUDE.md gotchas.)
- Prior session (commits `52aa01e`, `88cb4fa`) had already built auth actions, admin CRUD, cart sync, newsletter + migrations 0001–0003 — always re-scan repo state before building; my first hour's migration/seed files were duplicates and got deleted.
- `advisor` tool stays "unavailable" for the whole session once it errors (circuit-breaker behavior); fresh conversation likely restores it.

### Mistakes
- Ran a 103-agent deep-research workflow (~2.2M tokens, 44 agents died on session limit) for a question answerable with 2–3 web searches.
- Did 15+ files of schema/RLS/auth work with zero second-pass review and didn't flag the skipped checkpoint until asked.
- Wrote duplicate migration/seed before checking git log for prior session's work.

### Pending Tasks
- [ ] User: log in at `/auth/login` → confirm redirect to `/admin` with live stats (last unverified step).
- [ ] Verify admin products/content pages read+write live DB after login.
- [ ] Commit ~20 modified/new working-tree files once admin login confirmed.
- [ ] Stripe keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`) + register webhook endpoint.
- [ ] Resend keys (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`); order-confirmation emails still unbuilt.
- [ ] Later: real product photos, SEO, tests, legal pages (TODO.md §1, §9).

### Progress status
Supabase backend ~90% wired. Storefront + admin + auth fully coded and building; DB schema applied and seeded (8 products, 48 variants, 7 content keys, 9 community posts, storage bucket). User account created, confirmed, promoted to admin. Only login verification + Stripe/Resend keys remain.

### Blocked-on
User confirming admin login works (then commit).

### Next steps
Verify admin login → verify admin CRUD against live DB → commit → Stripe keys → Resend keys.

## Quick Resume Context
Session took the DBB store from "Supabase scaffolded but unreachable" to fully wired: fixed the wrong API URL in `.env`, built the live-query layer with mock fallback, completed auth (signup/login/logout/middleware guards), made the admin CMS save for real, applied+seeded the full schema, and promoted kirubelkibr@gmail.com to admin. Ended waiting on the user to confirm `/admin` login works; after that, commit the ~20 changed files and add Stripe/Resend keys.

## Raw Session Log
- Started from a tweet-inspired "advisor pattern" prompt discussion; researched CLAUDE.md best practices (deep-research workflow — overkill, noted in Mistakes) and rewrote repo CLAUDE.md.
- User pivoted to the real goal: finish all Supabase-related work from TODO.md (products/inventory in DB, admin dashboard, login/logout, cart history, newsletter).
- Re-scanned repo: discovered prior session's commits `52aa01e` + `88cb4fa` already contained auth actions, session helpers, account/orders/cart-sync, newsletter, admin CRUD + storage upload, and migrations 0001–0003 + seed.sql. Deleted my duplicate 001_init.sql/seed.mjs.
- DB check via service-role REST: zero tables — schema never applied. Root cause: `NEXT_PUBLIC_SUPABASE_URL` pointed at the dashboard URL. Fixed to `https://cnmlzhefradznbodikwa.supabase.co`; keys are new `sb_publishable_`/`sb_secret_` format and work.
- Wrote `supabase/migrations/0004_content_community.sql` (site_content + community_posts + RLS + default copy + community seed) matching the code's expectations (`profiles.role`, `carts`, etc.).
- Built `src/lib/data/queries.ts`; rewired ShopGrid (props), shop page, product detail (dropped generateStaticParams), FeaturedProducts, CommunitySection, community page, homepage (hero/ticker/quote from site_content), story page, admin dashboard (live orders count + paid revenue).
- Added `signOut` server action, SIGN OUT button on account page, account icon in navbar; replaced pass-through middleware with Supabase session refresh + `/admin`/`/account` redirect guard.
- Content editor: new `admin/content/actions.ts` `saveContent` (requireAdmin, upsert, revalidate); content page loads live values.
- Build passed (20 routes). Generated `supabase/APPLY_ALL.sql`; user pasted it in SQL Editor — verified 9 tables, seed data, bucket all live.
- "Website looks different" incident: stale prod server (PID 19172) serving old chunk hashes → all assets 404 → unstyled HTML. Killed it, restarted single dev server, screenshot-verified dark theme back. Gotcha added to CLAUDE.md.
- User signed up + confirmed email; promoted profile to `role='admin'` via service-role PATCH (verified 200).
- Advisor tool unavailable all session (errors persist after first failure); flagged every skipped check per new always-on rule.
