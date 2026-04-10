# Phase 1 Foundation And Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the monorepo, product shell, Express API, Supabase integration points, and authentication foundation needed for the rest of phase 1.

**Architecture:** Use a pnpm TypeScript monorepo with `apps/web` for the React shell, `apps/api` for the Express service, and `packages/*` for shared contracts, UI tokens, and configuration. Keep the app shell thin, push business rules into the API, and wire Supabase Auth as the shared identity layer.

**Tech Stack:** pnpm, TypeScript, Vite React, React Router, Express, Supabase, Zod, Vitest, Testing Library, ESLint, Prettier

---

## Locked Implementation Decisions

- The repo uses a pnpm monorepo with `apps/web`, `apps/api`, and shared `packages/*`.
- Every new user gets one default personal `account` at signup.
- `profiles` represent identity, `accounts` own portfolios and subscriptions, and `account_memberships` connect users to accounts.
- Supabase Auth is the identity source, while the API remains the authority for protected product behavior.
- Local, staging, and production environment shapes must be supported from the start.

## Ordered Execution Sequence

1. Bootstrap the workspace and toolchain.
2. Create shared contracts and design tokens.
3. Stand up the React shells and route groups.
4. Stand up the Express service skeleton.
5. Add Supabase auth integration and personal-account bootstrap.
6. Lock lint, test, and typecheck gates before further feature work.

## Global Verification Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @animated-resume/web build
pnpm --filter @animated-resume/api test
```

## Target File Map

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `apps/web/package.json`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/app/router.tsx`
- Create: `apps/web/src/app/providers.tsx`
- Create: `apps/web/src/app/layouts/MarketingShell.tsx`
- Create: `apps/web/src/app/layouts/ProductShell.tsx`
- Create: `apps/web/src/features/auth/pages/SignInPage.tsx`
- Create: `apps/web/src/features/auth/pages/SignUpPage.tsx`
- Create: `apps/web/src/features/dashboard/pages/DashboardPage.tsx`
- Create: `apps/web/src/styles/tokens.css`
- Create: `apps/api/package.json`
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/src/lib/env.ts`
- Create: `apps/api/src/lib/logger.ts`
- Create: `apps/api/src/lib/supabase.ts`
- Create: `apps/api/src/middleware/requireAuth.ts`
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/routes/auth.ts`
- Create: `supabase/migrations/0001_foundation.sql`
- Create: `packages/contracts/src/index.ts`
- Create: `packages/contracts/src/auth.ts`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/tokens.css`
- Create: `supabase/config.toml`
- Create: `.env.example`
- Create: `apps/web/src/app/router.test.tsx`
- Create: `apps/api/src/routes/health.test.ts`
- Create: `apps/api/src/routes/auth.test.ts`

### Task 1: Monorepo Bootstrap

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.env.example`

- [ ] Create the root workspace files with scripts for `dev`, `build`, `test`, `lint`, and `typecheck`.
- [ ] Set the workspace structure to include `apps/*`, `packages/*`, and shared TypeScript config.
- [ ] Add environment placeholders for Supabase, Gemini, Stripe, and public domain variables.
- [ ] Run `pnpm install` and verify the workspace resolves.
- [ ] Run `pnpm lint` and `pnpm typecheck` with placeholder package targets to verify the workspace shell is wired.
- [ ] Verification: `pnpm install && pnpm lint && pnpm typecheck`

### Task 2: Shared Contracts And UI Tokens

**Files:**
- Create: `packages/contracts/src/index.ts`
- Create: `packages/contracts/src/auth.ts`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/tokens.css`
- Create: `apps/web/src/styles/tokens.css`

- [ ] Define the initial auth/session contract in `packages/contracts`.
- [ ] Create shared design tokens for colors, spacing, radius, typography, and motion timing aligned to the editorial shell.
- [ ] Wire the web app token stylesheet to consume `packages/ui` tokens instead of raw hex values in components.
- [ ] Add a lightweight export surface from `packages/ui` for future shared primitives.
- [ ] Run `pnpm --filter @animated-resume/contracts test` or typecheck to verify exports resolve cleanly.
- [ ] Verification: `pnpm --filter @animated-resume/contracts typecheck && pnpm --filter @animated-resume/web typecheck`

### Task 3: React App Shells And Routing

**Files:**
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/app/router.tsx`
- Create: `apps/web/src/app/providers.tsx`
- Create: `apps/web/src/app/layouts/MarketingShell.tsx`
- Create: `apps/web/src/app/layouts/ProductShell.tsx`
- Create: `apps/web/src/features/auth/pages/SignInPage.tsx`
- Create: `apps/web/src/features/auth/pages/SignUpPage.tsx`
- Create: `apps/web/src/features/dashboard/pages/DashboardPage.tsx`
- Test: `apps/web/src/app/router.test.tsx`

- [ ] Stand up the Vite React app with route groups for marketing, auth, and product shell pages.
- [ ] Build `MarketingShell` and `ProductShell` so the visual split exists immediately.
- [ ] Create placeholder pages for sign-in, sign-up, and dashboard.
- [ ] Add protected-route behavior that redirects unauthenticated users away from product routes.
- [ ] Write route tests for public-vs-protected navigation and auth redirects.
- [ ] Run `pnpm --filter @animated-resume/web test` and `pnpm --filter @animated-resume/web build`.
- [ ] Verification: `pnpm --filter @animated-resume/web test && pnpm --filter @animated-resume/web build`

### Task 4: Express API Skeleton

**Files:**
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/server.ts`
- Create: `apps/api/src/lib/env.ts`
- Create: `apps/api/src/lib/logger.ts`
- Create: `apps/api/src/routes/health.ts`
- Test: `apps/api/src/routes/health.test.ts`

- [ ] Create the Express bootstrap with centralized middleware registration, error handling, and route mounting.
- [ ] Add environment parsing with Zod in `env.ts`.
- [ ] Add a health route that returns service metadata and environment-safe status.
- [ ] Add a structured logger abstraction to keep logs machine-readable from the start.
- [ ] Write API tests for `/health`.
- [ ] Run `pnpm --filter @animated-resume/api test`.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 5: Supabase Auth Integration

**Files:**
- Create: `apps/api/src/lib/supabase.ts`
- Create: `apps/api/src/middleware/requireAuth.ts`
- Create: `apps/api/src/routes/auth.ts`
- Create: `supabase/config.toml`
- Create: `supabase/migrations/0001_foundation.sql`
- Test: `apps/api/src/routes/auth.test.ts`

- [ ] Configure Supabase client creation for both user-context and service-role use.
- [ ] Add backend auth-session validation middleware.
- [ ] Create initial auth endpoints for session introspection and logout/session clear operations.
- [ ] Add the initial migration for `profiles`, `accounts`, and `account_memberships`.
- [ ] Create signup bootstrap logic that provisions a default personal account and owner membership for each new user.
- [ ] Add Supabase project config placeholders and local development structure.
- [ ] Write auth route tests for valid and invalid session handling.
- [ ] Run `pnpm --filter @animated-resume/api test`.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 6: Developer Experience And Quality Gates

**Files:**
- Modify: `package.json`
- Create: `.editorconfig`
- Create: `.gitignore`
- Create: `README.md`

- [ ] Add consistent formatter, lint, and typecheck scripts at root and package level.
- [ ] Add `.gitignore` entries for node modules, build output, local env files, and `.superpowers`.
- [ ] Create a minimal root `README.md` with workspace commands.
- [ ] Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- [ ] Commit with a message like `chore: bootstrap monorepo foundation and auth shell`.
- [ ] Verification: `pnpm lint && pnpm typecheck && pnpm test`
