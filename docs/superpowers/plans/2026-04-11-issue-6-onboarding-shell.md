# Issue 6 Onboarding Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the phase 1 onboarding wizard shell so authenticated users can choose an import source, move through processing, and land in a verification hub with a real handoff into the workspace.

**Architecture:** Keep the web changes isolated under `apps/web/src/features/onboarding`, using a thin API client, a shared `WizardLayout`, and route objects registered from the main app router. Add only the smallest browser-session seam needed to make the onboarding routes reachable outside tests, and treat the verification hub as a status checkpoint instead of a fake editor.

**Tech Stack:** React 18, React Router 6, TypeScript, Vitest, Testing Library, shared Zod-backed contracts from `@animated-resume/contracts`

---

## File Map

- Modify: `apps/web/src/app/router.tsx`
  Registers the onboarding route group and the minimal browser auth/session seam.
- Create: `apps/web/src/features/onboarding/routes.tsx`
  Owns onboarding route objects and route-local helpers.
- Create: `apps/web/src/features/onboarding/api.ts`
  Wraps draft fetches, import creation, and import-job polling.
- Create: `apps/web/src/features/onboarding/components/WizardLayout.tsx`
  Provides the shared onboarding frame, progress, and action slots.
- Create: `apps/web/src/features/onboarding/pages/WelcomePage.tsx`
  Entry page for the wizard.
- Create: `apps/web/src/features/onboarding/pages/ImportSourcePage.tsx`
  Source chooser plus inline LinkedIn basic form.
- Create: `apps/web/src/features/onboarding/pages/ResumeUploadPage.tsx`
  Resume-text submission page.
- Create: `apps/web/src/features/onboarding/pages/ImportProcessingPage.tsx`
  Polling and status rendering for import jobs.
- Create: `apps/web/src/features/onboarding/pages/VerificationHubPage.tsx`
  Section readiness checkpoint and handoff.
- Create: `apps/web/src/features/onboarding/onboarding.test.tsx`
  Covers route progression, layout behavior, and state transitions.
- Modify: `apps/web/src/features/dashboard/pages/DashboardPage.tsx`
  Provides a minimal onboarding handoff state.
- Modify: `apps/web/src/styles/tokens.css`
  Adds focused onboarding-specific layout styles while preserving the existing token language.

## Task 1: Register The Onboarding Route Group And Browser Session Seam

**Files:**
- Modify: `apps/web/src/app/router.tsx`
- Create: `apps/web/src/features/onboarding/routes.tsx`
- Test: `apps/web/src/app/router.test.tsx`

- [ ] **Step 1: Extend routing tests with an authenticated onboarding case**

```tsx
test("renders onboarding welcome for authenticated onboarding route", async () => {
  const router = createAppRouter({
    isAuthenticated: true,
    initialEntries: ["/app/onboarding/welcome"],
  });

  render(<RouterProvider router={router} />);

  expect(
    await screen.findByRole("heading", { name: "Build your first animated resume" }),
  ).toBeTruthy();
});
```

- [ ] **Step 2: Run the route test to verify it fails before the route exists**

Run: `pnpm --filter @animated-resume/web test -- router.test.tsx`
Expected: FAIL because `/app/onboarding/welcome` resolves to the fallback route instead of the onboarding page.

- [ ] **Step 3: Add a minimal browser auth seam and register onboarding routes**

```tsx
function resolveBrowserAuthState(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem("animated-resume:auth") !== "false";
}

export function createBrowserAppRouter(): ReturnType<typeof createBrowserRouter> {
  return createBrowserRouter(buildRoutes(resolveBrowserAuthState()));
}
```

```tsx
import { createOnboardingRoutes } from "../features/onboarding/routes";

function buildRoutes(isAuthenticated: boolean): RouteObject[] {
  return [
    // ...
    {
      path: "/app",
      element: <RequireAuth isAuthenticated={isAuthenticated} />,
      children: [
        {
          element: <ProductShell />,
          children: [
            { index: true, element: <Navigate to="/app/dashboard" replace /> },
            { path: "dashboard", element: <DashboardPage /> },
            createOnboardingRoutes(),
          ],
        },
      ],
    },
  ];
}
```

- [ ] **Step 4: Create the onboarding route object with a redirect-only placeholder first**

```tsx
export function createOnboardingRoutes(): RouteObject {
  return {
    path: "onboarding",
    children: [
      { index: true, element: <Navigate to="/app/onboarding/welcome" replace /> },
      { path: "welcome", element: <WelcomePage /> },
    ],
  };
}
```

- [ ] **Step 5: Re-run the route test and confirm the onboarding route resolves**

Run: `pnpm --filter @animated-resume/web test -- router.test.tsx`
Expected: PASS for the new onboarding route test.

- [ ] **Step 6: Commit the route-group baseline**

```bash
git add apps/web/src/app/router.tsx apps/web/src/features/onboarding/routes.tsx apps/web/src/app/router.test.tsx
git commit -m "feat(web): register onboarding route group"
```

## Task 2: Build The Shared Wizard Layout And Styling

**Files:**
- Create: `apps/web/src/features/onboarding/components/WizardLayout.tsx`
- Modify: `apps/web/src/styles/tokens.css`
- Test: `apps/web/src/features/onboarding/onboarding.test.tsx`

- [ ] **Step 1: Write a failing layout test for progress, back, and action slots**

```tsx
test("renders wizard progress and navigation controls", async () => {
  render(
    <WizardLayout
      title="Build your first animated resume"
      description="Import your information and review what needs attention."
      stepIndex={0}
      stepCount={5}
      backTo="/"
      primaryAction={<button type="button">Continue</button>}
    >
      <p>Child content</p>
    </WizardLayout>,
  );

  expect(screen.getByText("Step 1 of 5")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Back" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Continue" })).toBeTruthy();
});
```

- [ ] **Step 2: Run the onboarding test file to verify `WizardLayout` is missing**

Run: `pnpm --filter @animated-resume/web test -- onboarding.test.tsx`
Expected: FAIL because `WizardLayout` does not exist yet.

- [ ] **Step 3: Implement the shared layout**

```tsx
type WizardLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
  stepIndex: number;
  stepCount: number;
  backTo?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}>;

export function WizardLayout({
  title,
  description,
  stepIndex,
  stepCount,
  backTo,
  primaryAction,
  secondaryAction,
  children,
}: WizardLayoutProps) {
  const progress = ((stepIndex + 1) / stepCount) * 100;

  return (
    <section className="wizard-shell">
      <div className="wizard-frame">
        <header className="wizard-header">
          <div>
            <p className="wizard-step-label">{`Step ${stepIndex + 1} of ${stepCount}`}</p>
            <h1>{title}</h1>
            <p className="wizard-description">{description}</p>
          </div>
          <div className="wizard-progress" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div className="wizard-body">{children}</div>

        <footer className="wizard-actions">
          {backTo ? <Link to={backTo}>Back</Link> : <span />}
          <div className="wizard-action-group">
            {secondaryAction}
            {primaryAction}
          </div>
        </footer>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add focused onboarding styles**

```css
.wizard-shell {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  padding: var(--ar-space-6);
}

.wizard-frame {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), #ffffff);
  border: 1px solid var(--ar-color-border);
  border-radius: var(--ar-radius-lg);
  box-shadow: var(--ar-shadow-soft);
  max-width: 920px;
  padding: var(--ar-space-6);
  width: 100%;
}
```

- [ ] **Step 5: Re-run the onboarding test file and confirm the layout test passes**

Run: `pnpm --filter @animated-resume/web test -- onboarding.test.tsx`
Expected: PASS for the `WizardLayout` test.

- [ ] **Step 6: Commit the shared layout**

```bash
git add apps/web/src/features/onboarding/components/WizardLayout.tsx apps/web/src/styles/tokens.css apps/web/src/features/onboarding/onboarding.test.tsx
git commit -m "feat(web): add onboarding wizard layout"
```

## Task 3: Add The Onboarding API Client And Source Entry Screens

**Files:**
- Create: `apps/web/src/features/onboarding/api.ts`
- Create: `apps/web/src/features/onboarding/pages/WelcomePage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ImportSourcePage.tsx`
- Create: `apps/web/src/features/onboarding/pages/ResumeUploadPage.tsx`
- Modify: `apps/web/src/features/onboarding/routes.tsx`
- Test: `apps/web/src/features/onboarding/onboarding.test.tsx`

- [ ] **Step 1: Add a failing test for welcome-to-source progression and manual start**

```tsx
test("lets the user move from welcome to source selection and manual start", async () => {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    if (String(input).endsWith("/portfolio/draft")) {
      return new Response(JSON.stringify({ draft: createEmptyPortfolioDraft(portfolioId) }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    throw new Error(`Unhandled request: ${String(input)}`);
  });

  vi.stubGlobal("fetch", fetchMock);

  const router = createAppRouter({
    isAuthenticated: true,
    initialEntries: ["/app/onboarding/welcome"],
  });

  render(<RouterProvider router={router} />);

  await userEvent.click(await screen.findByRole("button", { name: "Choose a source" }));
  await userEvent.click(await screen.findByRole("button", { name: "Start manually" }));

  expect(await screen.findByRole("heading", { name: "Verification hub" })).toBeTruthy();
});
```

- [ ] **Step 2: Run the onboarding test file and confirm it fails before the pages exist**

Run: `pnpm --filter @animated-resume/web test -- onboarding.test.tsx`
Expected: FAIL because the pages and fetch helpers are missing.

- [ ] **Step 3: Implement the API client with centralized error handling**

```ts
const API_BASE = "";

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Request failed");
  }

  return data as T;
}

export async function getDraft() {
  return parseJson<{ draft: PortfolioDraft }>(await fetch(`${API_BASE}/portfolio/draft`));
}

export async function startResumeImport(payload: ResumeImportRequest) {
  return parseJson<ImportDraftResponseContract>(
    await fetch(`${API_BASE}/imports/resume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}
```

- [ ] **Step 4: Implement the welcome page and source page with the inline LinkedIn form**

```tsx
export function WelcomePage() {
  return (
    <WizardLayout
      title="Build your first animated resume"
      description="Import your information, review your draft, and continue into the workspace."
      stepIndex={0}
      stepCount={5}
      primaryAction={<Link className="button-primary" to="/app/onboarding/source">Choose a source</Link>}
    >
      <div className="wizard-card-grid">
        <article className="wizard-info-card">
          <h2>Three ways to start</h2>
          <p>Paste resume content, use LinkedIn basic details, or begin with an empty draft.</p>
        </article>
      </div>
    </WizardLayout>
  );
}
```

```tsx
const [linkedInForm, setLinkedInForm] = useState({
  fullName: "",
  headline: "",
  location: "",
  summary: "",
  email: "",
  phone: "",
  website: "",
  linkedinUrl: "",
});
```

- [ ] **Step 5: Implement the resume upload page and connect the routes**

```tsx
export function ResumeUploadPage() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await startResumeImport({ resumeText, fileName: fileName || undefined });
    navigate(`/app/onboarding/processing?jobId=${response.job.id}`, { replace: true });
  }

  return (
    <WizardLayout
      title="Paste your resume"
      description="We will normalize your content into the portfolio draft model."
      stepIndex={2}
      stepCount={5}
      backTo="/app/onboarding/source"
    >
      <form onSubmit={handleSubmit}>{/* inputs */}</form>
    </WizardLayout>
  );
}
```

- [ ] **Step 6: Re-run the onboarding tests for welcome, source, and manual flow**

Run: `pnpm --filter @animated-resume/web test -- onboarding.test.tsx`
Expected: PASS for welcome progression and manual-start behavior.

- [ ] **Step 7: Commit the API client and source entry screens**

```bash
git add apps/web/src/features/onboarding/api.ts apps/web/src/features/onboarding/pages/WelcomePage.tsx apps/web/src/features/onboarding/pages/ImportSourcePage.tsx apps/web/src/features/onboarding/pages/ResumeUploadPage.tsx apps/web/src/features/onboarding/routes.tsx apps/web/src/features/onboarding/onboarding.test.tsx
git commit -m "feat(web): add onboarding source entry screens"
```

## Task 4: Build Processing, Verification Hub, And Workspace Handoff

**Files:**
- Create: `apps/web/src/features/onboarding/pages/ImportProcessingPage.tsx`
- Create: `apps/web/src/features/onboarding/pages/VerificationHubPage.tsx`
- Modify: `apps/web/src/features/onboarding/routes.tsx`
- Modify: `apps/web/src/features/dashboard/pages/DashboardPage.tsx`
- Test: `apps/web/src/features/onboarding/onboarding.test.tsx`

- [ ] **Step 1: Add failing tests for processing success, failure recovery, and hub grouping**

```tsx
test("routes a successful import job into the verification hub", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/imports/jobs/job-1")) {
        return new Response(JSON.stringify({ job: processingJob }), { status: 200 });
      }

      if (url.endsWith("/portfolio/draft")) {
        return new Response(JSON.stringify({ draft: resumeDraft }), { status: 200 });
      }

      throw new Error(`Unhandled request: ${url}`);
    }),
  );

  const router = createAppRouter({
    isAuthenticated: true,
    initialEntries: ["/app/onboarding/processing?jobId=job-1"],
  });

  render(<RouterProvider router={router} />);

  expect(await screen.findByRole("heading", { name: "Verification hub" })).toBeTruthy();
  expect(screen.getByText("Needs review")).toBeTruthy();
});
```

- [ ] **Step 2: Run the onboarding test file to confirm processing and hub tests fail first**

Run: `pnpm --filter @animated-resume/web test -- onboarding.test.tsx`
Expected: FAIL because processing and verification pages do not exist yet.

- [ ] **Step 3: Implement import-job polling and recovery states**

```tsx
export function ImportProcessingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  useEffect(() => {
    if (!jobId) {
      return;
    }

    let cancelled = false;

    async function loadJob() {
      const { job } = await getImportJob(jobId);

      if (cancelled) {
        return;
      }

      if (job.status === "failed") {
        setState({ kind: "failed", message: job.errorMessage ?? "Import failed" });
        return;
      }

      if (job.status === "succeeded") {
        await getDraft();
        navigate("/app/onboarding/verification", { replace: true });
        return;
      }

      window.setTimeout(loadJob, 800);
    }

    void loadJob();
    return () => {
      cancelled = true;
    };
  }, [jobId, navigate]);
}
```

- [ ] **Step 4: Implement the verification hub with grouped section status cards**

```tsx
function groupSections(draft: PortfolioDraft) {
  return sectionKeys.reduce(
    (groups, key) => {
      const section = draft.metadata.sectionStates[key];
      const label = sectionLabels[key];

      if (section.score === 0) {
        groups.missing.push({ key, label, section });
      } else if (section.score < 0.75 || section.warnings.length > 0) {
        groups.review.push({ key, label, section });
      } else {
        groups.ready.push({ key, label, section });
      }

      return groups;
    },
    { ready: [], review: [], missing: [] } as SectionGroups,
  );
}
```

```tsx
<WizardLayout
  title="Verification hub"
  description="Review what looks solid, what needs attention, and continue into the workspace."
  stepIndex={4}
  stepCount={5}
  backTo="/app/onboarding/source"
  primaryAction={
    <button type="button" onClick={() => navigate("/app/dashboard", { state: { onboardingHandoff: true } })}>
      Continue to workspace
    </button>
  }
  secondaryAction={<Link to="/app/onboarding/source">Start another import</Link>}
>
  {/* grouped section cards */}
</WizardLayout>
```

- [ ] **Step 5: Update the dashboard to acknowledge the onboarding handoff**

```tsx
export function DashboardPage() {
  const location = useLocation();
  const fromOnboarding = Boolean(location.state && (location.state as { onboardingHandoff?: boolean }).onboardingHandoff);

  return (
    <section className="panel">
      <h1>Dashboard</h1>
      {fromOnboarding ? (
        <p>Your draft is in the workspace. Detailed section verification is the next milestone.</p>
      ) : (
        <p>Your portfolio workspace will be wired in subsequent Phase 1 issues.</p>
      )}
    </section>
  );
}
```

- [ ] **Step 6: Re-run the onboarding test file and confirm success, failure, and hub tests pass**

Run: `pnpm --filter @animated-resume/web test -- onboarding.test.tsx`
Expected: PASS for processing success, failure recovery, and hub grouping tests.

- [ ] **Step 7: Commit the processing and handoff flow**

```bash
git add apps/web/src/features/onboarding/pages/ImportProcessingPage.tsx apps/web/src/features/onboarding/pages/VerificationHubPage.tsx apps/web/src/features/onboarding/routes.tsx apps/web/src/features/dashboard/pages/DashboardPage.tsx apps/web/src/features/onboarding/onboarding.test.tsx
git commit -m "feat(web): add onboarding processing and verification hub"
```

## Task 5: Final Verification And Cleanup

**Files:**
- Modify: `apps/web/src/features/onboarding/onboarding.test.tsx`
- Modify: `apps/web/src/app/router.test.tsx`
- Modify: `apps/web/src/styles/tokens.css`

- [ ] **Step 1: Add or tighten any remaining tests for back behavior and invalid job ids**

```tsx
test("shows a recovery state when processing loads without a job id", async () => {
  const router = createAppRouter({
    isAuthenticated: true,
    initialEntries: ["/app/onboarding/processing"],
  });

  render(<RouterProvider router={router} />);

  expect(await screen.findByText("Missing import job")).toBeTruthy();
  expect(screen.getByRole("link", { name: "Choose another source" })).toBeTruthy();
});
```

- [ ] **Step 2: Run the focused web suite**

Run: `pnpm --filter @animated-resume/web test`
Expected: PASS for `router.test.tsx` and `onboarding.test.tsx`.

- [ ] **Step 3: Run the production build**

Run: `pnpm --filter @animated-resume/web build`
Expected: PASS with a successful Vite build and no TypeScript errors.

- [ ] **Step 4: Inspect the diff to verify only onboarding-scope files changed**

Run: `git diff --stat origin/main...HEAD && git status --short`
Expected: only the onboarding feature files, dashboard handoff, router registration, styles, and plan/spec docs are modified or staged.

- [ ] **Step 5: Commit the final polish and verification adjustments**

```bash
git add apps/web/src/features/onboarding/onboarding.test.tsx apps/web/src/app/router.test.tsx apps/web/src/styles/tokens.css
git commit -m "test(web): verify onboarding shell flows"
```
