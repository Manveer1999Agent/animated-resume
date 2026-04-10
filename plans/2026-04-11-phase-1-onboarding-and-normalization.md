# Phase 1 Onboarding And Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the guided onboarding wizard, resume and LinkedIn basic intake flows, normalized draft persistence, and verification UX for phase 1.

**Architecture:** Treat import sources as transient inputs that map into one normalized draft model. The backend owns import orchestration and mapping, while the web app renders a section-based wizard that highlights low-confidence sections and edits the normalized draft directly.

**Tech Stack:** React, React Router, React Hook Form, Zod, Express, Supabase, Gemini API, Vitest, Testing Library, Supertest

---

## Locked Implementation Decisions

- Import sources are transient; raw Gemini output is not retained as product data.
- Each portfolio has one mutable working draft at launch.
- Confidence must be stored at least at section level; field-level confidence is preferred.
- The launch UX exposes one visible portfolio, but the draft belongs to the user’s default personal account.
- Verification flows edit normalized draft structures directly rather than storing ad hoc form payloads.

## Ordered Execution Sequence

1. Define shared draft and import contracts.
2. Add import orchestration and mapping services.
3. Add normalized draft persistence and section CRUD.
4. Build the wizard shell and verification hub.
5. Build section editors.
6. Wire onboarding completion rules and route redirects.

## Global Verification Commands

```bash
pnpm --filter @animated-resume/contracts typecheck
pnpm --filter @animated-resume/api test
pnpm --filter @animated-resume/web test
pnpm --filter @animated-resume/web build
```

## Target File Map

- Create: `packages/contracts/src/portfolio.ts`
- Create: `packages/contracts/src/imports.ts`
- Create: `apps/api/src/routes/imports.ts`
- Create: `apps/api/src/routes/portfolio.ts`
- Create: `apps/api/src/services/imports/mapResumeToDraft.ts`
- Create: `apps/api/src/services/imports/mapLinkedInBasicToDraft.ts`
- Create: `apps/api/src/services/imports/runGeminiResumeParse.ts`
- Create: `apps/api/src/services/portfolio/upsertDraft.ts`
- Create: `apps/api/src/services/portfolio/getDraft.ts`
- Create: `apps/api/src/services/portfolio/updateSection.ts`
- Create: `supabase/migrations/0002_portfolio_drafts.sql`
- Create: `supabase/migrations/0003_import_jobs.sql`
- Create: `apps/web/src/features/onboarding/routes.tsx`
- Create: `apps/web/src/features/onboarding/pages/WelcomePage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ImportSourcePage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ResumeUploadPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ImportProcessingPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/VerificationHubPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ProfileStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ExperienceStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ProjectsStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/EducationStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/SkillsStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/LinksStepPage.tsx`
- Create: `apps/web/src/features/onboarding/components/WizardLayout.tsx`
- Create: `apps/web/src/features/onboarding/components/ConfidenceFlag.tsx`
- Create: `apps/web/src/features/onboarding/api.ts`
- Create: `apps/api/src/routes/imports.test.ts`
- Create: `apps/api/src/routes/portfolio.test.ts`
- Create: `apps/web/src/features/onboarding/onboarding.test.tsx`

### Task 1: Draft And Import Contracts

**Files:**
- Create: `packages/contracts/src/portfolio.ts`
- Create: `packages/contracts/src/imports.ts`

- [ ] Define the `PortfolioDraft`, `ImportJob`, section-state, and confidence metadata contracts exactly once in `packages/contracts`.
- [ ] Include enum-like unions for `sourceType`, `motionLevel`, and section keys.
- [ ] Export validation schemas for server and client use.
- [ ] Typecheck the contracts package after adding exports.
- [ ] Commit the contract baseline before wiring API or UI consumers.
- [ ] Verification: `pnpm --filter @animated-resume/contracts typecheck`

### Task 2: Import Orchestration In The API

**Files:**
- Create: `apps/api/src/routes/imports.ts`
- Create: `apps/api/src/services/imports/runGeminiResumeParse.ts`
- Create: `apps/api/src/services/imports/mapResumeToDraft.ts`
- Create: `apps/api/src/services/imports/mapLinkedInBasicToDraft.ts`
- Test: `apps/api/src/routes/imports.test.ts`

- [ ] Add upload and import routes for resume parsing and LinkedIn basic identity prefill.
- [ ] Implement Gemini orchestration as a transient parser step that returns mapped normalized data, not stored raw output.
- [ ] Create a mapping layer that converts import results into the canonical draft structure with section confidence summaries.
- [ ] Return import-job status payloads that the UI can poll or await.
- [ ] Write API tests for resume import success, import validation failure, and LinkedIn basic mapping behavior.
- [ ] Run `pnpm --filter @animated-resume/api test`.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 3: Draft Persistence And Section CRUD

**Files:**
- Create: `apps/api/src/routes/portfolio.ts`
- Create: `apps/api/src/services/portfolio/upsertDraft.ts`
- Create: `apps/api/src/services/portfolio/getDraft.ts`
- Create: `apps/api/src/services/portfolio/updateSection.ts`
- Test: `apps/api/src/routes/portfolio.test.ts`

- [ ] Add endpoints to get the current draft, update section payloads, and persist verification status.
- [ ] Model section updates so each wizard step can save independently.
- [ ] Compute or update completion score and `lastVerifiedAt` on meaningful section saves.
- [ ] Add migrations for normalized draft content tables and import-job tracking tables.
- [ ] Write API tests for draft reads, section updates, and unauthorized access rejection.
- [ ] Run `pnpm --filter @animated-resume/api test`.
- [ ] Verification: `pnpm --filter @animated-resume/api test`

### Task 4: Wizard Shell And Flow Control

**Files:**
- Create: `apps/web/src/features/onboarding/routes.tsx`
- Create: `apps/web/src/features/onboarding/components/WizardLayout.tsx`
- Create: `apps/web/src/features/onboarding/pages/WelcomePage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ImportSourcePage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ImportProcessingPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/VerificationHubPage.tsx`
- Create: `apps/web/src/features/onboarding/api.ts`
- Test: `apps/web/src/features/onboarding/onboarding.test.tsx`

- [ ] Add the onboarding route group and a shared wizard layout with progress, back, and continue controls.
- [ ] Create entry pages for welcome, source selection, and processing states.
- [ ] Create the verification hub that shows which sections need review and which are ready.
- [ ] Add loading and failure states for import processing.
- [ ] Write UI tests for route progression, progress display, and section-status presentation.
- [ ] Run `pnpm --filter @animated-resume/web test`.
- [ ] Verification: `pnpm --filter @animated-resume/web test`

### Task 5: Section Verification Screens

**Files:**
- Create: `apps/web/src/features/onboarding/pages/ProfileStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ExperienceStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ProjectsStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/EducationStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/SkillsStepPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/LinksStepPage.tsx`
- Create: `apps/web/src/features/onboarding/components/ConfidenceFlag.tsx`

- [ ] Build each section page as a focused editor over normalized draft data, not a generic schema dump.
- [ ] Surface low-confidence fields or sections using a clear confidence flag treatment.
- [ ] Add add/edit/delete support for repeatable entities like experience and projects.
- [ ] Preserve mobile usability and clear error handling for incomplete or invalid fields.
- [ ] Verify each step can save and continue independently.
- [ ] Verification: `pnpm --filter @animated-resume/web test`

### Task 6: Completion, Redirects, And Integration Tests

**Files:**
- Modify: `apps/web/src/app/router.tsx`
- Modify: `apps/web/src/features/dashboard/pages/DashboardPage.tsx`
- Test: `apps/web/src/features/onboarding/onboarding.test.tsx`

- [ ] Route first-time users into onboarding until the required verification baseline is complete.
- [ ] Redirect verified users into the dashboard.
- [ ] Add end-to-end style UI tests that cover:
  - resume upload to verification hub
  - manual section edits
  - save and continue flow
  - redirect to the next phase entry point
- [ ] Run `pnpm --filter @animated-resume/web test`.
- [ ] Commit with a message like `feat: add guided onboarding and normalized draft flow`.
- [ ] Verification: `pnpm --filter @animated-resume/web test && pnpm --filter @animated-resume/web build`
