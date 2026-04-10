# Phase 3 Multi-Portfolio And Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose Pro multi-portfolio support in the product UX and add growth-oriented surfaces without breaking the simplicity of the default user path.

**Architecture:** The schema is already multi-portfolio ready, so this phase focuses on safely exposing the capability in the UI, tightening entitlement checks, and improving growth loops around templates, portfolios, and upgrades.

**Tech Stack:** React, Express, Supabase, Stripe, analytics services, Vitest

---

## Phase-Entry Validation

- Reconfirm that portfolios belong to accounts and subscriptions remain account-level.
- Refresh the file map against the live repository before starting this phase.
- Validate that the production entitlement model still uses `canUseMultiplePortfolios` and that free users remain constrained to one visible portfolio.

## Target File Map

- Create: `apps/web/src/features/portfolios/pages/PortfolioSwitcherPage.tsx`
- Create: `apps/web/src/features/portfolios/components/PortfolioCard.tsx`
- Create: `apps/web/src/features/portfolios/components/NewPortfolioDialog.tsx`
- Create: `apps/api/src/routes/portfolios.ts`
- Create: `apps/api/src/services/portfolios/listPortfolios.ts`
- Create: `apps/api/src/services/portfolios/createPortfolio.ts`
- Create: `apps/api/src/services/portfolios/archivePortfolio.ts`
- Create: `apps/api/src/services/growth/getUpgradeMoments.ts`
- Create: `apps/web/src/features/growth/components/UpgradeMomentsPanel.tsx`
- Create: `apps/api/src/routes/portfolios.test.ts`

### Task 1: Portfolio List And Switcher APIs

**Files:**
- Create: `apps/api/src/routes/portfolios.ts`
- Create: `apps/api/src/services/portfolios/listPortfolios.ts`
- Create: `apps/api/src/services/portfolios/createPortfolio.ts`
- Create: `apps/api/src/services/portfolios/archivePortfolio.ts`
- Create: `apps/api/src/routes/portfolios.test.ts`

- [ ] Expose portfolio listing and creation services for accounts that have the right entitlements.
- [ ] Preserve one-portfolio behavior for free users.
- [ ] Add archive behavior rather than hard delete for user-owned portfolios.
- [ ] Test entitlement-aware list and create flows.

### Task 2: Multi-Portfolio UX

**Files:**
- Create: `apps/web/src/features/portfolios/pages/PortfolioSwitcherPage.tsx`
- Create: `apps/web/src/features/portfolios/components/PortfolioCard.tsx`
- Create: `apps/web/src/features/portfolios/components/NewPortfolioDialog.tsx`

- [ ] Build the portfolio switcher and creation UX for Pro accounts.
- [ ] Keep the default path simple for free users.
- [ ] Clearly separate current live portfolio, drafts, and archived entries.
- [ ] Verify navigation and context switching do not create draft confusion.

### Task 3: Entitlement Enforcement Review

**Files:**
- Modify: `apps/api/src/services/billing/getEntitlements.ts`
- Modify: `apps/web/src/features/billing/pages/BillingPage.tsx`

- [ ] Add the `canUseMultiplePortfolios` entitlement to the production gating path.
- [ ] Surface upgrade value clearly where users hit the portfolio limit.
- [ ] Ensure server-side enforcement is authoritative.

### Task 4: Growth Loops

**Files:**
- Create: `apps/api/src/services/growth/getUpgradeMoments.ts`
- Create: `apps/web/src/features/growth/components/UpgradeMomentsPanel.tsx`
- Modify: `apps/web/src/features/workspace/pages/WorkspaceHomePage.tsx`

- [ ] Add upgrade moments based on portfolio count, template interest, domain demand, and analytics usage.
- [ ] Keep prompts contextual and tied to clear product value.
- [ ] Avoid spammy banners or generic growth hacks.

### Task 5: Optional Studio Experiments

**Files:**
- Create: `apps/web/src/features/experiments/studio-preview.tsx`
- Create: `apps/web/src/features/experiments/studio-preview.test.tsx`

- [ ] Prototype limited studio-like enhancements only if they build on the structured model and do not replace it.
- [ ] Keep the experiment behind a feature flag.
- [ ] Validate that the experience remains simpler than a no-code page builder.

### Task 6: Phase Review

**Files:**
- Modify: `docs/specs/2026-04-11-animated-resume-platform-design.md`

- [ ] Verify multi-portfolio exposure still matches the original “schema ready, UX later” decision.
- [ ] Run the full quality suite.
- [ ] Commit with a message like `feat: expose Pro multi-portfolio support and growth loops`.
