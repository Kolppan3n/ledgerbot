# Copilot Instructions for `ledgerbot`

## Project snapshot

- Stack: Next.js 16 (App Router) + React 19 + TypeScript strict mode.
- Current app surface is minimal: one route in `src/app/page.tsx` and global shell in `src/app/layout.tsx`.
- Product goal: personal spending insights from shopping receipts (not a mass-scale multi-tenant app).
- Primary outcome: analyze purchase habits across everyday utilities, groceries, bills, and other store purchases.
- This repo is an early scaffold; prefer small, incremental changes over broad architecture additions.

## Architecture and boundaries

- App Router files live in `src/app/`:
  - `layout.tsx` is the global HTML/body wrapper + font setup (`next/font/google`).
  - `page.tsx` is the root route UI.
  - `globals.css` defines theme tokens, dark mode variables, and base Tailwind layers.
- Shared utilities go in `src/lib/` (example: `src/lib/utils.ts` exports `cn()` for class merging).
- Reserved but currently empty folders:
  - `src/hooks/` for custom React hooks.
  - `src/types/` for shared TS types/interfaces.

## Routing conventions (finalized)

- Keep clean user-facing URLs (do not prefix product pages with `/app`).
- Use route groups in `src/app/` for organization without affecting URLs (for example `(public)`, `(auth)`, `(protected)`).
- Public pages include at minimum:
  - `/` as landing page.
  - `/login` as auth entry page.
- Protected pages start with:
  - `/dashboard` as post-login default.
  - `/scan` as the primary receipt capture/upload flow (can be shipped early).
  - `/receipts`, `/receipts/upload`, `/receipts/[receiptId]` for receipt workflow.
  - `/insights` after core receipt parsing flow is stable.

## Core product flow (build toward this)

- User uploads a receipt image.
- AI parses receipt text and normalizes into individual line items.
- Each line item is stored as structured data for reporting/insight features.
- AI assigns tags per item; minimum required dimensions:
  - Necessity type: `mandatory` or `luxury`.
  - Recurrence type: `recurring` or `one_time`.
  - Category label (example: carrots -> `groceries` + `mandatory` + `one_time`; internet bill -> `utilities` + `mandatory` + `recurring`).

## Data modeling expectations

- Prefer explicit enums/unions for required tags over free-form strings where possible.
- Keep normalized item-level records; do not store receipt analysis only as raw text blobs.
- Add shared interfaces in `src/types/` when introducing receipt/item/tag schemas.
- Put parsing/classification helpers in `src/lib/` so UI remains thin.
- Use Zod schemas at API and form boundaries for runtime validation and typed parsing.

## Conventions to follow in this codebase

- Use `@/*` path alias imports (configured in `tsconfig.json`) instead of deep relative paths.
- For className composition, use `cn(...)` from `@/lib/utils` (not manual string concatenation for conditional classes).
- Keep Tailwind/style tokens aligned with `src/app/globals.css` and existing shadcn CSS-variable setup.
- Keep components TypeScript-first and compatible with strict mode (`"strict": true`).
- Preserve App Router patterns; do not reintroduce `pages/` patterns.
- Use Prettier for formatting consistency and avoid unrelated style-only churn in feature commits.

## UI system + dependencies

- `components.json` indicates shadcn configuration (`style: new-york`, CSS vars, `src/app/globals.css`).
- Tailwind v4 is configured through CSS imports in `globals.css` (`tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`).
- React Compiler is enabled in `next.config.ts` (`reactCompiler: true`); avoid patterns that rely on unstable side effects in render.
- Installed dependencies available for upcoming features: `@tanstack/react-query`, `react-hook-form`, `zod`, `radix-ui`, `lucide-react`.

## Developer workflows

- Install deps: `npm install`
- Run dev server: `npm run dev`
- Production build: `npm run build`
- Run built app: `npm run start`
- Lint: `npm run lint`
- Format (if configured): `npx prettier --write .`
- There is currently no test script configured in `package.json`; do not assume Jest/Vitest/Cypress exists.

## Deployment and hosting notes

- Production hosting platform: Vercel.
- Production database: Neon PostgreSQL.
- Keep all runtime credentials/config in environment variables (for example database URL/API keys), never hardcoded.
- Prefer deployment-friendly defaults for Vercel serverless/edge environments (stateless handlers, no filesystem assumptions).

## API and security conventions (finalized)

- API is private-by-default and authentication-protected.
- Authentication library is BetterAuth, using the latest stable release.
- Use REST-style, versioned endpoints under `/api/v1/*`.
- Prefer resource-oriented routes for receipts/items/insights; use nested resources where appropriate.
- For analysis execution, prefer resource creation style (for example `POST /api/v1/receipts/:id/analyses`) over ad-hoc action naming.
- Enforce ownership checks on every protected read/write (users can access only their own receipt/item data).
- Apply layered route protection:
  - Middleware for coarse path protection.
  - Server-side session/authorization checks in protected layouts and all API handlers.
- Use secure cookie-based sessions for auth; avoid exposing sensitive tokens in client storage.

## Agent guidance for edits

- Prefer focused edits in existing files over generating large new structures.
- Build one page/feature at a time; prioritize shipping the end-to-end receipt pipeline before expanding surface area.
- If adding new UI, keep it in App Router style and reuse theme variables/utilities already present.
- When introducing shared code, place it under `src/lib`, `src/hooks`, or `src/types` according to responsibility.
- If adding shadcn-style components, keep aliases and theme-token usage consistent with `components.json` + `globals.css`.
- Prioritize correctness and inspectability of parsed receipt items/tags over advanced UI polish.
