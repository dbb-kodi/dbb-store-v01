# CLAUDE.md

## Project

DBB ("Done Being Broke") — streetwear e-commerce storefront. Next.js 14 App Router, TypeScript, Tailwind. Stripe checkout, Zustand cart, Resend email. Supabase is scaffolded but NOT connected yet.

## Commands

- `npm run dev` — dev server at localhost:3000
- `npm run build` — production build; run this to verify changes (there is no test suite)
- `npm run lint` — ESLint via next lint

## Architecture

- All product/community data comes from the static mock catalog in `src/lib/data/catalog.ts`. Supabase clients exist in `src/lib/supabase/` but are not wired up — route any new data reads through `catalog.ts` so the later swap to live queries stays in one file.
- Shared domain types live in `src/types/index.ts` and are backend-independent; conform to them when adding fields.
- Cart state is a Zustand store in `src/lib/store/cart.ts`; `CartDrawer` renders from the root layout.
- Stripe: `src/app/api/stripe/checkout` creates sessions; `src/app/api/stripe/webhook` is deliberately excluded from the middleware matcher — keep it that way.
- `src/middleware.ts` is a pass-through until Supabase auth is connected; don't add ad-hoc auth checks in pages.
- Storefront routes under `src/app/*`; admin under `src/app/admin/*` with its own layout and sidebar.

## Conventions

- Path alias `@/*` → `src/*`.
- Product images: Unsplash URLs mapped per-slug in `catalog.ts`, with `placeholderImage()` SVG data-URI fallback. `next.config.js` sets `images.unoptimized: true` (data URIs can't be optimized) and allowlists unsplash/placehold/supabase hosts — add new image hosts there.

## Gotchas / Environment

- No tests exist. Verification = `npm run build` passing + manually exercising the affected flow.
- Env vars required once backends connect: Supabase URL + anon key, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`.
- If a task is interrupted by a usage limit, continue it when the limit resets.

## Advisor Pattern (cost-optimized)

Default: current (cheap/fast) model executes all work. Escalate to the strong-model `advisor` tool (if available) only for: planning at task start on non-trivial tasks, getting unstuck, and final review before declaring done. Executor does 90%+ of tool calls. If a task needs multi-agent orchestration, delegate token-heavy subtasks to workers with `model: 'sonnet'`. Give serious weight to advisor output.

## Skills

Proactively invoke any available skill whose description matches the current task — don't wait for the slash command. Load only what the task needs; never stack overlapping skills (e.g. multiple design skills) in one task.
