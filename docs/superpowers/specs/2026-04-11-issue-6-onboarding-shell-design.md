# Issue 6 Onboarding Shell Design

Related issue:
- [#6](https://github.com/Manveer1999Agent/animated-resume/issues/6)

Related docs:
- [Platform Design Spec](../../specs/2026-04-11-animated-resume-platform-design.md)
- [UI/UX Guidelines](../../ui-ux/2026-04-11-product-ui-ux-guidelines.md)
- [Flow Diagrams](../../architecture/2026-04-11-flow-diagrams.md)
- [Phase 1 Onboarding Plan](../../../plans/2026-04-11-phase-1-onboarding-and-normalization.md)

## Goal

Build the phase 1 onboarding shell that moves an authenticated user from entry into import-source selection, through import processing, and into a verification hub that clearly communicates draft readiness without implementing the detailed section editors yet.

## Scope

- Add an authenticated onboarding route group under `/app/onboarding`
- Build a shared `WizardLayout` with progress, back navigation, and primary action placement
- Build welcome, source selection, resume upload, processing, and verification hub screens
- Expose all three onboarding sources in this issue:
  - resume import
  - LinkedIn basic prefill
  - manual start
- Implement a frontend onboarding API client for draft reads, import creation, and import-job polling
- Register the onboarding route group from the main app router
- Add UI tests for route progression, processing states, and wizard shell behavior

## Out Of Scope

- Detailed section editor screens such as profile, experience, projects, education, skills, or links
- Template selection, preview, publish, or completion flows beyond the verification checkpoint
- Full browser auth implementation beyond the minimum route/session seam needed to exercise onboarding in the current app
- Backend import or draft persistence changes beyond consuming the existing API surfaces

## Product Decision

The verification hub is the terminal screen for this issue.

It is not a fake editor and it is not a dead end. The hub acts as a status checkpoint that:
- shows which draft sections are ready
- highlights weak or missing sections
- surfaces import warnings
- explains that detailed verification continues in the workspace flow
- routes the user forward with a clear `Continue to workspace` action

This keeps issue `#6` honest to scope while still giving the user a real next step.

## Information Architecture

The onboarding shell will use this route progression:

1. `/app/onboarding`
   Redirects to `/app/onboarding/welcome`
2. `/app/onboarding/welcome`
   Introduces the guided flow and explains what the user will accomplish
3. `/app/onboarding/source`
   Lets the user choose resume import, LinkedIn basic prefill, or manual start
4. `/app/onboarding/resume`
   Collects resume text and file name metadata before starting an import
5. `/app/onboarding/processing?jobId=...`
   Polls import status for resume and LinkedIn basic jobs
6. `/app/onboarding/verification`
   Shows section readiness and next-step guidance using the latest draft data

## Screen Behavior

### Welcome

- Sets expectations for a short guided setup
- Explains that the user will import or seed a draft, then review readiness
- Primary action routes to source selection

### Import Source

- Shows all three sources in this issue
- Resume:
  Routes to the dedicated resume upload page
- LinkedIn basic:
  Uses an inline compact form on the source page for identity prefill fields, then starts an import job and routes to processing
- Manual:
  Fetches or seeds the working draft and routes directly to the verification hub
- The page must handle pending submission and inline error states without trapping the user

### Resume Upload

- Collects `resumeText` and optional `fileName`
- Starts a resume import job through the onboarding API client
- Routes to processing with the returned `jobId`
- Provides a clear back path to source selection

### Import Processing

- Polls `/imports/jobs/:jobId`
- Renders `processing`, `succeeded`, and `failed` states
- On success, fetches the current draft and routes to the verification hub
- On failure, offers:
  - `Try again`
  - `Choose another source`
- The page must not leave the user in a spinner-only dead state

### Verification Hub

- Loads the current draft
- Groups sections into:
  - Ready
  - Needs review
  - Missing or weak
- Uses section confidence metadata and warnings from the normalized draft
- Shows concise section cards rather than editor forms
- Provides:
  - primary action: `Continue to workspace`
  - secondary action: `Start another import`
- Includes copy that explains detailed section editing is the next step in the workspace roadmap rather than pretending it exists here

## Wizard Layout

`WizardLayout` will provide the shared shell for all onboarding screens.

Required responsibilities:
- show the current step title
- show step progress across the onboarding route set
- render a consistent back action
- provide a slot for primary and secondary actions
- remain fully usable at mobile widths
- use the existing product tokens and calm editorial visual language

The layout should not reuse the sidebar-heavy workspace shell because onboarding needs a guided, focused frame rather than a persistent navigation chrome.

## API Client Design

`apps/web/src/features/onboarding/api.ts` will centralize browser calls for:
- `getDraft`
- `startResumeImport`
- `startLinkedInBasicImport`
- `getImportJob`

The client should:
- parse server responses against shared contracts where available
- normalize error handling into a single shape the pages can render
- keep fetch logic out of page components

## Auth And Runtime Seam

The current browser router is hard-coded to an unauthenticated state, while tests inject authenticated routing explicitly.

This issue should introduce a minimal browser-side session seam so onboarding can run in the app without pulling full auth implementation into scope. The seam only needs to support:
- checking whether product routes should render
- preserving the existing route guard model in tests
- avoiding a browser build where onboarding is unreachable by design

The seam should stay small and avoid inventing a large auth state layer.

## Dashboard Handoff

`DashboardPage` should be updated just enough to acknowledge the onboarding handoff.

Expected behavior:
- users who continue from the verification hub land on a workspace page that feels like a deliberate next step
- the dashboard should not claim that verification is complete if the draft still has weak sections

## Error Handling

The onboarding shell must provide explicit recovery paths for:
- failed resume import
- failed LinkedIn basic import
- failed draft fetch
- missing or invalid import `jobId`

Each state should show the user what happened and what they can do next. No screen should strand the user without navigation or a retry path.

## Testing Strategy

Add onboarding-focused tests that cover:
- authenticated routing into the onboarding group
- welcome to source progression
- resume submission into processing and then verification hub
- LinkedIn basic submission into processing and then verification hub
- manual start into verification hub
- processing failure recovery actions
- wizard layout progress and back behavior
- verification hub section grouping and status rendering

The tests should remain scoped to the shell behavior described in issue `#6`, not future editor workflows.

## Acceptance Mapping

This design satisfies the issue acceptance criteria by ensuring:
- users can enter onboarding and choose an input source
- import processing has explicit success, loading, and failure states
- the verification hub communicates which sections are ready and which need review
- the flow has a real exit path into the workspace
- tests cover route progression and core wizard behavior

## Implementation Notes

- Touch `apps/web/src/app/router.tsx` only to register the onboarding route group and the minimum session seam needed to make browser routing practical
- Keep the onboarding feature isolated under `apps/web/src/features/onboarding`
- Do not add placeholder section editor routes in this issue
- Prefer small reusable helpers over coupling page components directly to fetch and navigation details
