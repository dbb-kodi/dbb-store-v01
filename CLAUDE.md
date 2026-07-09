# CLAUDE.md

## Project

DBB ("Done Being Broke") — streetwear e-commerce storefront. Next.js 14 App Router, TypeScript, Tailwind. Stripe checkout, Zustand cart, Resend email. Supabase is wired for auth/DB/storage — schema lives in `supabase/migrations/`, applied via `supabase/APPLY_ALL.sql` (combined, paste into SQL Editor).

## Commands

- `npm run dev` — dev server at localhost:3000
- `npm run build` — production build; run this to verify changes (there is no test suite)
- `npm run lint` — ESLint via next lint

## Architecture

- Live data reads go through `src/lib/data/queries.ts` (server-only — uses `next/headers`). Each function tries Supabase first, falls back to the static mock catalog in `src/lib/data/catalog.ts` if the table is empty/unconfigured, so pages never crash without a backend.
- Shared domain types live in `src/types/index.ts` and are backend-independent; conform to them when adding fields.
- Cart state is a Zustand store in `src/lib/store/cart.ts`; `CartDrawer` renders from the root layout. Logged-in carts also sync to the `carts` table via `src/components/CartSync.tsx` + `src/app/account/cart-actions.ts`.
- Stripe: `src/app/api/stripe/checkout` creates sessions and persists a pending `orders`/`order_items` row; `src/app/api/stripe/webhook` marks orders paid/cancelled and is deliberately excluded from the middleware matcher — keep it that way.
- `src/middleware.ts` refreshes the Supabase session cookie every request and redirects unauthenticated visitors away from `/admin` and `/account`. Admin role check (`profiles.role === 'admin'`) still happens in `src/app/admin/layout.tsx` via `requireAdmin()` — middleware only gates "logged in or not".
- Storefront routes under `src/app/*`; admin under `src/app/admin/*` with its own layout and sidebar. Admin writes (products/variants/content) go through server actions in `src/app/admin/*/actions.ts` using `requireAdmin()`.

## Conventions

- Path alias `@/*` → `src/*`.
- Product images: Unsplash URLs mapped per-slug in `catalog.ts`, with `placeholderImage()` SVG data-URI fallback. `next.config.js` sets `images.unoptimized: true` (data URIs can't be optimized) and allowlists unsplash/placehold/supabase hosts — add new image hosts there.

## Gotchas / Environment

- No tests exist. Verification = `npm run build` passing + manually exercising the affected flow.
- Env vars: Supabase URL + anon key + service role key are set in `.env` (project ref `cnmlzhefradznbodikwa`). `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`/`RESEND_API_KEY` still needed for payments/email.
- Only ever run one Next server at a time. `npm run dev` and `npm run start` write incompatible `.next` layouts to the same folder — leaving one running while rebuilding/starting another causes the live server to 404 on all JS/CSS chunks (page loads as unstyled raw HTML). Kill anything on port 3000 before starting a new server.
- If a task is interrupted by a usage limit, continue it when the limit resets.

## Advisor Pattern (always-on)

For every task, no matter how small — always use both tactics, not gated by task type or perceived triviality:

1. **Advisor:** call the `advisor` tool for every task — at task start (plan/approach) and again before declaring done (review). Not "rare," not scoped to "non-trivial" — every task, every time it's available.
2. **Subagents:** delegate work out to subagents (`Agent` tool, `model: 'sonnet'` workers, or `Workflow` for multi-step work) rather than doing everything inline on the main thread — regardless of which model is currently executing.

If advisor is unavailable or errors, say so plainly rather than silently proceeding as if the check happened. Give serious weight to advisor output — don't silently override without new evidence.

## Skills

Proactively invoke any available skill whose description matches the current task — don't wait for the slash command. Load only what the task needs; never stack overlapping skills (e.g. multiple design skills) in one task.
