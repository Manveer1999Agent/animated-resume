# Phase 2 Workspace And Retention Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the phase 1 product into a stronger day-2 workspace with better dashboarding, version history, rollback, media handling, and retention surfaces.

**Architecture:** Keep the onboarding-first model intact, but strengthen the authenticated workspace as the primary place users return to after first publish. Extend the existing draft/version/publish architecture rather than replacing it with a new editing paradigm.

**Tech Stack:** React, Express, Supabase, storage workers, Vitest, Testing Library

---

## Phase-Entry Validation

- Reconfirm that the account ownership model, draft snapshot model, and route-cache publish path from phase 1 shipped as designed.
- Refresh the file map against the live repository before implementation starts.
- Revalidate dashboard metrics and version-history requirements against production usage before changing scope.

## Target File Map

- Create: `apps/web/src/features/workspace/pages/WorkspaceHomePage.tsx`
- Create: `apps/web/src/features/workspace/components/NextActionsCard.tsx`
- Create: `apps/web/src/features/versions/pages/VersionHistoryPage.tsx`
- Create: `apps/web/src/features/versions/components/VersionList.tsx`
- Create: `apps/web/src/features/versions/components/RollbackDialog.tsx`
- Create: `apps/web/src/features/media/pages/MediaLibraryPage.tsx`
- Create: `apps/web/src/features/media/components/MediaUploadPanel.tsx`
- Create: `apps/api/src/routes/versions.ts`
- Create: `apps/api/src/routes/media.ts`
- Create: `apps/api/src/services/versions/listPortfolioVersions.ts`
- Create: `apps/api/src/services/versions/rollbackPortfolioVersion.ts`
- Create: `apps/api/src/services/media/uploadMediaAsset.ts`
- Create: `apps/api/src/services/media/listMediaAssets.ts`
- Create: `apps/api/src/services/retention/getNextActions.ts`
- Create: `apps/web/src/features/workspace/api.ts`
- Create: `apps/web/src/features/versions/api.ts`
- Create: `apps/web/src/features/media/api.ts`
- Create: `apps/api/src/routes/versions.test.ts`
- Create: `apps/api/src/routes/media.test.ts`

### Task 1: Workspace Dashboard Upgrade

**Files:**
- Create: `apps/web/src/features/workspace/pages/WorkspaceHomePage.tsx`
- Create: `apps/web/src/features/workspace/components/NextActionsCard.tsx`
- Create: `apps/web/src/features/workspace/api.ts`

- [ ] Replace the phase 1 placeholder dashboard with a structured workspace homepage.
- [ ] Show live status, last publish date, completion score, views, and next recommended actions.
- [ ] Add retention-oriented prompts such as updating projects, improving profile completeness, or upgrading templates.
- [ ] Verify the dashboard stays mobile-safe and action-oriented.

### Task 2: Version History

**Files:**
- Create: `apps/api/src/routes/versions.ts`
- Create: `apps/api/src/services/versions/listPortfolioVersions.ts`
- Create: `apps/web/src/features/versions/pages/VersionHistoryPage.tsx`
- Create: `apps/web/src/features/versions/components/VersionList.tsx`
- Test: `apps/api/src/routes/versions.test.ts`

- [ ] Add a version-history endpoint that returns publish versions with timestamps, template release info, and live-state markers.
- [ ] Build a version-history page in the workspace.
- [ ] Make active vs historical versions obvious.
- [ ] Add tests for version listing and authorization boundaries.

### Task 3: Rollback UX And API

**Files:**
- Create: `apps/api/src/services/versions/rollbackPortfolioVersion.ts`
- Create: `apps/web/src/features/versions/components/RollbackDialog.tsx`
- Modify: `apps/api/src/routes/versions.ts`

- [ ] Implement rollback to a previous successful published version without forcing a rebuild.
- [ ] Add a confirm-and-rollback UX with clear warnings.
- [ ] Ensure rollback updates live-version metadata and cache invalidation.
- [ ] Add tests for successful rollback and invalid target rejection.

### Task 4: Media Library And Better Asset Handling

**Files:**
- Create: `apps/api/src/routes/media.ts`
- Create: `apps/api/src/services/media/uploadMediaAsset.ts`
- Create: `apps/api/src/services/media/listMediaAssets.ts`
- Create: `apps/web/src/features/media/pages/MediaLibraryPage.tsx`
- Create: `apps/web/src/features/media/components/MediaUploadPanel.tsx`
- Test: `apps/api/src/routes/media.test.ts`

- [ ] Introduce a workspace media library for project assets and avatars.
- [ ] Support upload, list, and selection flows for reusable media assets.
- [ ] Keep asset metadata tied to portfolio ownership.
- [ ] Add tests for media upload authorization and listing.

### Task 5: Retention And Lifecycle Nudges

**Files:**
- Create: `apps/api/src/services/retention/getNextActions.ts`
- Modify: `apps/web/src/features/workspace/pages/WorkspaceHomePage.tsx`

- [ ] Add a simple next-actions service that recommends meaningful improvements.
- [ ] Base suggestions on completion score, stale publish dates, missing projects, or unused Pro features.
- [ ] Keep prompts helpful rather than spammy.
- [ ] Verify the card system degrades gracefully for already-healthy portfolios.

### Task 6: Phase Review

**Files:**
- Modify: `docs/product/2026-04-11-phased-execution-roadmap.md`

- [ ] Confirm all phase-2 workspace work still aligns with the product spec and UI/UX rules.
- [ ] Run `pnpm test`, `pnpm lint`, and `pnpm typecheck`.
- [ ] Commit with a message like `feat: expand workspace with version history and retention tools`.
