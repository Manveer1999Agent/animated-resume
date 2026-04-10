# Phase 1 Templates Preview And Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the internal template catalog, preview flow, publish jobs, versioned artifacts, and hosted-subdomain public delivery path.

**Architecture:** Use internally curated React template packages that accept the canonical draft contract and compile to static artifact bundles. Keep preview and publish on the same render pipeline, but separate preview persistence from live version activation.

**Tech Stack:** React, Vite, Express, Supabase Storage, Zod, Vitest, Supertest

---

## Locked Implementation Decisions

- Publish creates an immutable `draft_snapshot` before artifact generation.
- `portfolio_versions` reference `draft_snapshot_id`, never the mutable working draft directly.
- Hosted route bindings remain source-of-truth in Postgres, but live public resolution reads from an edge route metadata cache synchronized during activation and rollback.
- Slugs are editable until first publish and locked afterward in phase 1.
- Preview and publish share the same template compilation path.

## Ordered Execution Sequence

1. Define template and publish contracts.
2. Create the starter template release.
3. Build template catalog APIs and UI.
4. Build preview generation.
5. Build publish jobs, snapshotting, and activation.
6. Add hosted public resolution through route-cache-backed metadata.

## Global Verification Commands

```bash
pnpm --filter @animated-resume/contracts typecheck
pnpm --filter @animated-resume/api test
pnpm --filter @animated-resume/web test
pnpm --filter @animated-resume/web build
```

## Target File Map

- Create: `packages/contracts/src/template.ts`
- Create: `packages/contracts/src/publish.ts`
- Create: `packages/templates/src/index.ts`
- Create: `packages/templates/src/releases/editorial-starter/index.tsx`
- Create: `packages/templates/src/releases/editorial-starter/contract.ts`
- Create: `packages/templates/src/releases/editorial-starter/theme.ts`
- Create: `apps/api/src/routes/templates.ts`
- Create: `apps/api/src/routes/publish.ts`
- Create: `apps/api/src/services/templates/getTemplateCatalog.ts`
- Create: `apps/api/src/services/publish/createPreviewArtifact.ts`
- Create: `apps/api/src/services/publish/createPublishedArtifact.ts`
- Create: `apps/api/src/services/publish/createDraftSnapshot.ts`
- Create: `apps/api/src/services/publish/activatePortfolioVersion.ts`
- Create: `apps/api/src/services/publish/syncRouteMetadataCache.ts`
- Create: `apps/api/src/services/publish/renderTemplateRelease.ts`
- Create: `apps/web/src/features/templates/pages/TemplateGalleryPage.tsx`
- Create: `apps/web/src/features/templates/pages/TemplateDetailPage.tsx`
- Create: `apps/web/src/features/publish/pages/PreviewPage.tsx`
- Create: `apps/web/src/features/publish/pages/PublishPage.tsx`
- Create: `apps/web/src/features/publish/pages/PublishSuccessPage.tsx`
- Create: `apps/web/src/features/templates/api.ts`
- Create: `apps/web/src/features/publish/api.ts`
- Create: `apps/api/src/routes/templates.test.ts`
- Create: `apps/api/src/routes/publish.test.ts`
- Create: `apps/web/src/features/publish/publish.test.tsx`
- Create: `supabase/migrations/0004_publish_versioning.sql`

### Task 1: Template Contract And Starter Release

**Files:**
- Create: `packages/contracts/src/template.ts`
- Create: `packages/templates/src/index.ts`
- Create: `packages/templates/src/releases/editorial-starter/index.tsx`
- Create: `packages/templates/src/releases/editorial-starter/contract.ts`
- Create: `packages/templates/src/releases/editorial-starter/theme.ts`

- [ ] Define the `TemplateContract` and release metadata in the shared contracts package.
- [ ] Create the first free template release, `editorial-starter`, aligned to the product shell and launch audience.
- [ ] Encode supported sections, required fields, theme tokens, and motion profile explicitly.
- [ ] Export the starter release through `packages/templates`.
- [ ] Typecheck the templates and contracts packages together.
- [ ] Verification: `pnpm --filter @animated-resume/contracts typecheck`

### Task 2: Template Catalog APIs And UI

**Files:**
- Create: `apps/api/src/routes/templates.ts`
- Create: `apps/api/src/services/templates/getTemplateCatalog.ts`
- Create: `apps/web/src/features/templates/pages/TemplateGalleryPage.tsx`
- Create: `apps/web/src/features/templates/pages/TemplateDetailPage.tsx`
- Create: `apps/web/src/features/templates/api.ts`
- Test: `apps/api/src/routes/templates.test.ts`

- [ ] Add API endpoints for listing templates and retrieving release detail.
- [ ] Include tier status, supported sections, motion profile, and preview metadata in the response.
- [ ] Build the template gallery and detail views in the web app.
- [ ] Ensure cards show free vs Pro state and best-for messaging.
- [ ] Write API and UI tests for catalog rendering and template selection behavior.
- [ ] Verification: `pnpm --filter @animated-resume/api test && pnpm --filter @animated-resume/web test`

### Task 3: Preview Pipeline

**Files:**
- Create: `packages/contracts/src/publish.ts`
- Create: `apps/api/src/services/publish/renderTemplateRelease.ts`
- Create: `apps/api/src/services/publish/createPreviewArtifact.ts`
- Create: `apps/web/src/features/publish/pages/PreviewPage.tsx`
- Create: `apps/web/src/features/publish/api.ts`
- Test: `apps/api/src/routes/publish.test.ts`

- [ ] Define preview and publish job contracts.
- [ ] Implement template render orchestration that maps a normalized draft into typed template props.
- [ ] Add preview generation that writes temporary artifact output to a preview location.
- [ ] Build the preview page so it reflects the same compiled output path used by publish.
- [ ] Write tests for preview generation and preview-access flows.
- [ ] Verification: `pnpm --filter @animated-resume/api test && pnpm --filter @animated-resume/web test`

### Task 4: Publish Jobs, Version Records, And Activation

**Files:**
- Create: `apps/api/src/routes/publish.ts`
- Create: `apps/api/src/services/publish/createDraftSnapshot.ts`
- Create: `apps/api/src/services/publish/createPublishedArtifact.ts`
- Create: `apps/api/src/services/publish/activatePortfolioVersion.ts`
- Create: `apps/api/src/services/publish/syncRouteMetadataCache.ts`
- Create: `supabase/migrations/0004_publish_versioning.sql`
- Test: `apps/api/src/routes/publish.test.ts`

- [ ] Add publish endpoints that validate draft completeness, entitlement, and template compatibility.
- [ ] Add a migration for `draft_snapshots`, `portfolio_versions`, `published_artifacts`, and route-binding support.
- [ ] Create an immutable draft snapshot before version creation.
- [ ] Create publish-job records and portfolio-version records as part of the workflow.
- [ ] Ensure activation only occurs after artifact persistence succeeds.
- [ ] Sync active route metadata into the edge route cache during activation and rollback.
- [ ] Preserve the previous active version for rollback readiness.
- [ ] Write tests for publish success, validation failure, and activation safety.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 5: Publish UI Flow

**Files:**
- Create: `apps/web/src/features/publish/pages/PublishPage.tsx`
- Create: `apps/web/src/features/publish/pages/PublishSuccessPage.tsx`
- Test: `apps/web/src/features/publish/publish.test.tsx`

- [ ] Build the publish summary screen with target URL, template name, and readiness summary.
- [ ] Build a publish success state that confirms live URL and next actions.
- [ ] Make draft vs live status visually distinct in the UI.
- [ ] Write UI tests for preview-to-publish progression and success-state rendering.
- [ ] Verification: `pnpm --filter @animated-resume/web test`

### Task 6: Hosted Subdomain Delivery

**Files:**
- Create: `apps/web/src/features/public/portfolioResolver.ts`
- Create: `apps/web/src/features/public/HostedPortfolioPage.tsx`
- Modify: `apps/web/src/app/router.tsx`
- Test: `apps/web/src/features/public/hostedPortfolio.test.tsx`

- [ ] Add the public route or resolver path for hosted subdomain requests.
- [ ] Resolve the active published artifact from synchronized route metadata and render the immutable output.
- [ ] Keep public read behavior separated from authenticated draft routes.
- [ ] Add tests that verify active-version resolution and non-live draft isolation.
- [ ] Commit with a message like `feat: add template preview and versioned publish flow`.
- [ ] Verification: `pnpm --filter @animated-resume/web test && pnpm --filter @animated-resume/web build`
