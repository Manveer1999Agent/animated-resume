# Phase 1 Billing Analytics And Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Stripe-backed free and Pro billing, entitlement checks, basic analytics, and the minimum admin tools required to operate the phase 1 product safely.

**Architecture:** Use Stripe as the billing source of truth and mirror product-relevant subscription state into Supabase. Keep analytics lightweight and aggregated, and build admin as a role-gated surface inside the product shell rather than as a separate tool.

**Tech Stack:** Stripe, React, Express, Supabase, Zod, Vitest, Supertest

---

## Locked Implementation Decisions

- Subscriptions and entitlements belong to `accounts`, not directly to profiles.
- Each phase 1 user has one personal account, but billing must already use account-level state.
- Analytics are aggregated and entitlement-aware.
- Platform admin access is separate from account ownership and should not be inferred from billing status.

## Ordered Execution Sequence

1. Define billing contracts and entitlements.
2. Add Stripe checkout and webhook reconciliation.
3. Build billing UI.
4. Add basic analytics aggregation and UI.
5. Build minimum admin surfaces.
6. Enforce entitlement checks end-to-end.

## Global Verification Commands

```bash
pnpm --filter @animated-resume/api test
pnpm --filter @animated-resume/web test
pnpm test
```

## Target File Map

- Create: `packages/contracts/src/billing.ts`
- Create: `apps/api/src/routes/billing.ts`
- Create: `apps/api/src/routes/analytics.ts`
- Create: `apps/api/src/routes/admin.ts`
- Create: `apps/api/src/services/billing/createCheckoutSession.ts`
- Create: `apps/api/src/services/billing/handleStripeWebhook.ts`
- Create: `apps/api/src/services/billing/getEntitlements.ts`
- Create: `apps/api/src/services/analytics/recordPortfolioView.ts`
- Create: `apps/api/src/services/analytics/getPortfolioAnalytics.ts`
- Create: `supabase/migrations/0005_billing_and_analytics.sql`
- Create: `apps/web/src/features/billing/pages/BillingPage.tsx`
- Create: `apps/web/src/features/analytics/pages/AnalyticsPage.tsx`
- Create: `apps/web/src/features/admin/pages/AdminOverviewPage.tsx`
- Create: `apps/web/src/features/admin/pages/TemplateAdminPage.tsx`
- Create: `apps/web/src/features/admin/pages/JobsAdminPage.tsx`
- Create: `apps/web/src/features/billing/api.ts`
- Create: `apps/web/src/features/analytics/api.ts`
- Create: `apps/web/src/features/admin/api.ts`
- Create: `apps/api/src/routes/billing.test.ts`
- Create: `apps/api/src/routes/analytics.test.ts`
- Create: `apps/api/src/routes/admin.test.ts`

### Task 1: Billing Contracts And Entitlements

**Files:**
- Create: `packages/contracts/src/billing.ts`
- Create: `apps/api/src/services/billing/getEntitlements.ts`

- [ ] Define billing tier and entitlement contracts in `packages/contracts`.
- [ ] Encode free and Pro capability checks centrally.
- [ ] Ensure template gating, branding removal, analytics depth, and future premium features can be represented.
- [ ] Typecheck contracts and service helpers together.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 2: Stripe Checkout And Webhooks

**Files:**
- Create: `apps/api/src/routes/billing.ts`
- Create: `apps/api/src/services/billing/createCheckoutSession.ts`
- Create: `apps/api/src/services/billing/handleStripeWebhook.ts`
- Test: `apps/api/src/routes/billing.test.ts`

- [ ] Add a checkout-session endpoint for Pro upgrades.
- [ ] Implement Stripe webhook handling with idempotent state updates.
- [ ] Mirror account-level subscription state into Supabase product tables.
- [ ] Add API tests for checkout creation and webhook reconciliation.
- [ ] Run `pnpm --filter @animated-resume/api test`.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 3: Billing UI

**Files:**
- Create: `apps/web/src/features/billing/pages/BillingPage.tsx`
- Create: `apps/web/src/features/billing/api.ts`

- [ ] Build the billing page with current plan, benefits, and upgrade CTA.
- [ ] Show clear Pro benefits tied to actual product behavior.
- [ ] Keep billing UI consistent with the editorial shell rather than generic Stripe-dashboard aesthetics.
- [ ] Verify free users see upgrade prompts in the right places.
- [ ] Verification: `pnpm --filter @animated-resume/web test`

### Task 4: Basic Analytics

**Files:**
- Create: `apps/api/src/routes/analytics.ts`
- Create: `apps/api/src/services/analytics/recordPortfolioView.ts`
- Create: `apps/api/src/services/analytics/getPortfolioAnalytics.ts`
- Create: `apps/web/src/features/analytics/pages/AnalyticsPage.tsx`
- Create: `apps/web/src/features/analytics/api.ts`
- Test: `apps/api/src/routes/analytics.test.ts`

- [ ] Implement aggregated analytics capture for public portfolio views.
- [ ] Add a migration for subscriptions, subscription events, and analytics rollup tables.
- [ ] Expose only basic metrics in phase 1: total views, recent views, last published date, and completion score context.
- [ ] Build the analytics page inside the user workspace.
- [ ] Write tests for analytics reads and entitlement-aware analytics depth.
- [ ] Verification: `pnpm --filter @animated-resume/api test && pnpm --filter @animated-resume/web test`

### Task 5: Admin Surface

**Files:**
- Create: `apps/api/src/routes/admin.ts`
- Create: `apps/web/src/features/admin/pages/AdminOverviewPage.tsx`
- Create: `apps/web/src/features/admin/pages/TemplateAdminPage.tsx`
- Create: `apps/web/src/features/admin/pages/JobsAdminPage.tsx`
- Create: `apps/web/src/features/admin/api.ts`
- Test: `apps/api/src/routes/admin.test.ts`

- [ ] Create admin-only endpoints for template summaries, import jobs, publish jobs, and user overviews.
- [ ] Build the minimal admin pages required for phase 1 operations.
- [ ] Gate admin routes through backend role checks.
- [ ] Write tests that verify non-admin access is blocked.
- [ ] Verification: `pnpm --filter @animated-resume/api test && pnpm --filter @animated-resume/web test`

### Task 6: End-To-End Gating Checks

**Files:**
- Modify: `apps/api/src/routes/templates.ts`
- Modify: `apps/api/src/routes/publish.ts`
- Modify: `apps/web/src/features/templates/pages/TemplateDetailPage.tsx`

- [ ] Enforce Pro template gating in API and UI.
- [ ] Enforce branding and analytics depth by entitlement.
- [ ] Verify free-to-Pro state changes update the product correctly after webhook sync.
- [ ] Run `pnpm test`.
- [ ] Commit with a message like `feat: add billing entitlements analytics and admin tooling`.
- [ ] Verification: `pnpm test`
