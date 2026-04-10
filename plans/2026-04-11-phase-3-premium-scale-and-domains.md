# Phase 3 Premium Scale And Domains Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the premium-scale features that materially increase product credibility and monetization: custom domains, advanced SEO, premium template packs, and cost-conscious public-delivery controls.

**Architecture:** Build on the phase 1 and 2 published-artifact model rather than bypassing it. Custom domains and premium features should still resolve to versioned artifacts and entitlement-aware template releases.

**Tech Stack:** React, Express, Supabase, DNS/provider integration, Stripe entitlements, background jobs

---

## Phase-Entry Validation

- Reconfirm that hosted subdomain resolution already runs through synchronized route metadata and not request-time database reads.
- Refresh the file map against the live repository before starting this phase.
- Validate entitlement naming and premium template packaging before layering custom domains and SEO controls on top.

## Target File Map

- Create: `apps/api/src/routes/domains.ts`
- Create: `apps/api/src/services/domains/createDomainVerification.ts`
- Create: `apps/api/src/services/domains/verifyDomainBinding.ts`
- Create: `apps/api/src/services/domains/activateCustomDomain.ts`
- Create: `apps/api/src/services/seo/buildSeoManifest.ts`
- Create: `apps/web/src/features/domains/pages/DomainsPage.tsx`
- Create: `apps/web/src/features/domains/components/DomainStatusCard.tsx`
- Create: `apps/web/src/features/seo/pages/SeoSettingsPage.tsx`
- Create: `apps/web/src/features/templates/pages/PremiumTemplatesPage.tsx`
- Create: `apps/api/src/routes/domains.test.ts`
- Create: `apps/api/src/routes/seo.test.ts`

### Task 1: Custom Domain Data And Verification Flow

**Files:**
- Create: `apps/api/src/routes/domains.ts`
- Create: `apps/api/src/services/domains/createDomainVerification.ts`
- Create: `apps/api/src/services/domains/verifyDomainBinding.ts`
- Create: `apps/api/src/routes/domains.test.ts`

- [ ] Add custom-domain APIs for create, verify, and status-check flows.
- [ ] Persist verification tokens and domain-binding status.
- [ ] Restrict access to Pro entitlements.
- [ ] Add tests for domain ownership flow and entitlement rejection.

### Task 2: Domain Activation

**Files:**
- Create: `apps/api/src/services/domains/activateCustomDomain.ts`
- Modify: `apps/api/src/services/publish/activatePortfolioVersion.ts`

- [ ] Allow the active published artifact to bind to a verified custom domain.
- [ ] Keep hosted subdomain fallback intact.
- [ ] Ensure activation changes remain rollback-safe.
- [ ] Add tests for domain activation and fallback behavior.

### Task 3: Domains UI

**Files:**
- Create: `apps/web/src/features/domains/pages/DomainsPage.tsx`
- Create: `apps/web/src/features/domains/components/DomainStatusCard.tsx`
- Create: `apps/web/src/features/domains/api.ts`

- [ ] Build the domain-management screen with setup steps and verification feedback.
- [ ] Keep the setup UX procedural and supportable.
- [ ] Show why the feature is Pro-only when relevant.

### Task 4: Advanced SEO Controls

**Files:**
- Create: `apps/api/src/services/seo/buildSeoManifest.ts`
- Create: `apps/web/src/features/seo/pages/SeoSettingsPage.tsx`
- Create: `apps/api/src/routes/seo.test.ts`

- [ ] Add richer SEO controls for title, description, OG image, and metadata validation.
- [ ] Ensure SEO settings feed into the published artifact build process.
- [ ] Add tests around metadata validation and artifact output.

### Task 5: Premium Templates And Motion Packs

**Files:**
- Create: `apps/web/src/features/templates/pages/PremiumTemplatesPage.tsx`
- Modify: `packages/templates/src/index.ts`
- Modify: `apps/api/src/services/templates/getTemplateCatalog.ts`

- [ ] Add premium template-pack grouping and clearer premium discovery paths.
- [ ] Introduce premium motion variants without violating global accessibility rules.
- [ ] Ensure premium releases remain compatibility-aware and entitlement-gated.

### Task 6: Cost And Delivery Review

**Files:**
- Modify: `docs/architecture/2026-04-11-system-architecture.md`

- [ ] Review public artifact caching, invalidation behavior, and storage growth assumptions.
- [ ] Add any needed pruning or retention strategy for previews and stale artifacts.
- [ ] Run the full quality suite.
- [ ] Commit with a message like `feat: add premium domains SEO and template scale features`.
