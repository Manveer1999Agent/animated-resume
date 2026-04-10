# Phase 2 Operations And Template Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make template releases, compatibility checks, and operational monitoring robust enough for a growing production product.

**Architecture:** Formalize templates as managed releases with compatibility metadata and admin tooling. Extend operational visibility around import and publish jobs so support and release management can happen inside the product.

**Tech Stack:** React, Express, Supabase, background jobs, Vitest, Supertest

---

## Phase-Entry Validation

- Reconfirm the released template contract, draft snapshot model, and publish activation path before implementing this phase.
- Refresh the file map against the live repository and remove any files that were renamed during phase 1.
- Validate that admin roles and account ownership are still represented the same way in production code.

## Target File Map

- Create: `apps/api/src/services/templates/createTemplateRelease.ts`
- Create: `apps/api/src/services/templates/publishTemplateRelease.ts`
- Create: `apps/api/src/services/templates/deprecateTemplateRelease.ts`
- Create: `apps/api/src/services/templates/checkTemplateCompatibility.ts`
- Create: `apps/api/src/services/jobs/listOperationalJobs.ts`
- Create: `apps/api/src/services/jobs/getJobTimeline.ts`
- Create: `apps/web/src/features/admin/pages/TemplateReleasePage.tsx`
- Create: `apps/web/src/features/admin/pages/OperationalJobsPage.tsx`
- Create: `apps/web/src/features/admin/components/CompatibilityPanel.tsx`
- Create: `apps/web/src/features/admin/components/JobTimeline.tsx`
- Modify: `apps/api/src/routes/admin.ts`
- Modify: `apps/api/src/routes/publish.ts`
- Create: `apps/api/src/routes/templateLifecycle.test.ts`
- Create: `apps/api/src/routes/operationalJobs.test.ts`

### Task 1: Template Release Lifecycle Services

**Files:**
- Create: `apps/api/src/services/templates/createTemplateRelease.ts`
- Create: `apps/api/src/services/templates/publishTemplateRelease.ts`
- Create: `apps/api/src/services/templates/deprecateTemplateRelease.ts`
- Create: `apps/api/src/routes/templateLifecycle.test.ts`

- [ ] Implement create, publish, and deprecate flows for template releases.
- [ ] Keep release status explicit: draft, published, deprecated.
- [ ] Ensure existing live portfolios are not broken when a newer release is added.
- [ ] Add tests for lifecycle transitions.

### Task 2: Template Compatibility Checks

**Files:**
- Create: `apps/api/src/services/templates/checkTemplateCompatibility.ts`
- Modify: `apps/api/src/routes/publish.ts`
- Create: `apps/web/src/features/admin/components/CompatibilityPanel.tsx`

- [ ] Add compatibility checks for schema version, required fields, and unsupported sections.
- [ ] Block publish when a release is incompatible with the current draft.
- [ ] Surface compatibility reasons clearly in admin and publish responses.
- [ ] Test compatibility failures and successful publish checks.

### Task 3: Template Release Admin UI

**Files:**
- Create: `apps/web/src/features/admin/pages/TemplateReleasePage.tsx`
- Modify: `apps/web/src/features/admin/api.ts`

- [ ] Add admin UI for release detail, status transitions, and compatibility inspection.
- [ ] Show adoption signals for each release where available.
- [ ] Keep release actions clearly separated from general template catalog browsing.

### Task 4: Operational Job Visibility

**Files:**
- Create: `apps/api/src/services/jobs/listOperationalJobs.ts`
- Create: `apps/api/src/services/jobs/getJobTimeline.ts`
- Create: `apps/web/src/features/admin/pages/OperationalJobsPage.tsx`
- Create: `apps/web/src/features/admin/components/JobTimeline.tsx`
- Create: `apps/api/src/routes/operationalJobs.test.ts`

- [ ] Add job listing and job timeline services for import and publish operations.
- [ ] Build admin views that show status, duration, error codes, and affected portfolio/template references.
- [ ] Add tests for admin-only job visibility.

### Task 5: Stronger Failure Recovery Paths

**Files:**
- Modify: `apps/api/src/services/publish/createPublishedArtifact.ts`
- Modify: `apps/api/src/services/imports/runGeminiResumeParse.ts`
- Modify: `apps/web/src/features/admin/pages/JobsAdminPage.tsx`

- [ ] Add retry-safe state transitions for failed import and publish jobs.
- [ ] Expose meaningful retry and inspect paths in admin.
- [ ] Ensure failed operations never leave live bindings in an inconsistent state.

### Task 6: Phase Review

**Files:**
- Modify: `docs/architecture/2026-04-11-publish-pipeline.md`

- [ ] Verify operational lifecycle work still matches the publish and template architecture docs.
- [ ] Run the full quality suite.
- [ ] Commit with a message like `feat: add template lifecycle and operational visibility`.
