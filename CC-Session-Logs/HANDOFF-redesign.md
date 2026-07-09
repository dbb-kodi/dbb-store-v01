# HANDOFF — DBB redesign to 10/10 (advisor-enabled continuation)

## Why this handoff
Prev session's `advisor` tool was stuck "unavailable" (harness disabled it after first
failure, persisted across VSCode restart). Advisor works in the terminal session, so
continue the redesign there. Everything below is durable on disk.

## Project
DBB ("Done Being Broke") streetwear store. Next.js 14 App Router, TypeScript, Tailwind,
Supabase (live), Zustand cart, Stripe (keys pending), Resend (keys pending).
Repo: c:\Users\kirub\OneDrive\Documents\Github\dbb-store-v01  · branch kira_v01

## State (done, working)
- Supabase fully wired + seeded: 8 products, 48 variants, site_content, community_posts, storage bucket.
- Live query layer src/lib/data/queries.ts (Supabase-first, mock fallback).
- Auth done: signup/login/logout, middleware guards /admin + /account.
- User kirubelkibr@gmail.com = ADMIN (promoted via service key). Admin panel reads live DB.
- Login SIGN IN button got a pending-state fix: src/components/auth/SubmitButton.tsx (useFormStatus).
- Dev server pattern GOTCHA: only ONE next server at a time. Never run `npm run build` while
  `npm run dev` is live — corrupts .next, page 404s all chunks / "missing required error components".
  Fix = kill port 3000, rm -rf .next, restart single `npm run dev`. (Hit this twice already.)

## Active task: redesign storefront 6.1/10 -> 10/10
User wants: multi-model expert PANEL + an OPPOSING/adversary AI, debate, synthesize ONLY
best-of-best into a 10/10 plan. Advisor = the adversary/reviewer (now available in terminal).

### Expert audit already done (6.1/10)
- First impression/hero 7.5 · visual craft 6.5 · typography 6.5 · brand identity 4.0 (weakest)
- product presentation 3.5 (killer) · UX/IA 7.0 · commerce/conversion 5.0 · motion 4.5 · tech 5.5
- Product page is genuinely strong (8/10) — preserve.
- 5 gaps to close: (1) real art-directed product photography [#1], (2) ownable visual identity,
  (3) drop/scarcity mechanic, (4) kinetic motion, (5) kill bugs.
- Recommended scope = EVOLVE + FIX (preserve strong bones), not full teardown.

### Known BUG to fix regardless
src/components/shop/ProductCard.tsx:25 — checks only `variants[0].stock_qty===0`. Seed sets
XS (first variant) to 0 on every product, so EVERY shop card falsely shows "SOLD OUT".
Fix: check total stock across all variants (sold out only if every variant 0).

### Off-brand imagery problem
src/lib/data/catalog.ts image maps = random Unsplash: Adidas beanie (competitor), CDC biohazard
bag as "tote", visible photographer watermarks. Biggest credibility hit. Needs real/AI product photos.

## Panel plan to rerun (in terminal, with advisor)
3 parallel expert subagents, different models, each read-only + grounded in real files:
1. Art Direction & Photography — model opus. Files: catalog.ts, queries.ts, ProductCard/ProductDetail/HeroSection/CategoryGrid, next.config.js.
2. Brand Identity + Typography + Motion — model sonnet. Files: tailwind.config.js, globals.css, layout.tsx, HeroSection/TickerTape/MessageSection, Navbar/Footer. NOTE: no animation lib installed yet.
3. Commerce + Drops + Conversion — model fable. Files: types/index.ts, queries.ts, ProductCard/ProductDetail/AddToCartButton/SizeSelector, cart.ts, stripe/checkout, newsletter/actions, migrations.
Then: call advisor as the adversary to attack every idea, keep only survivors, synthesize 10/10 roadmap.
Full prompts for each expert are in prev session; regenerate from the lens + files above.

## Rules (CLAUDE.md — obey)
- Advisor + subagent tactic ALWAYS-ON, every task (user rejected scoping twice). Advisor at plan start + before done.
- Delegate bulk work to sonnet subagents even when main model is strong.
- Verify = `npm run build` + exercise the flow (no test suite).
- Caveman mode ON (ultra). Code/commits normal.

## Files
- Plan skeleton: C:\Users\kirub\.claude\plans\ok-i-want-you-wild-quiche.md
- Session log: CC-Session-Logs\2026-07-08-1215-supabase-wiring.md
- This handoff: CC-Session-Logs\HANDOFF-redesign.md

## First move in terminal
1. Confirm advisor works (call it).
2. Fix the SOLD OUT bug + decide imagery approach (AI-gen vs sourced).
3. Rerun the 3-expert panel + advisor adversary -> write 10/10 plan to the plan file.
