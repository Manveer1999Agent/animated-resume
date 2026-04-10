# Animated Resume Product UI/UX Guidelines

Related docs:
- [Platform Design Spec](../specs/2026-04-11-animated-resume-platform-design.md)
- [System Architecture](../architecture/2026-04-11-system-architecture.md)

## Design Intent

The Animated Resume product shell should feel premium, calm, and purposeful. It should help users confidently shape career information into a public portfolio without making the app feel like either a boring HR form or a loud experimental design playground.

The authenticated product and marketing site should follow one coherent shell language. Public portfolio templates can express more variation, but they should still remain readable and professional.

## Visual Direction

### Product shell

- Editorial, structured, warm-neutral baseline
- High readability, clear hierarchy, generous whitespace
- Selective gradient accents only on marketing surfaces and upgrade moments
- Card-based layout with disciplined radius and restrained shadows
- Premium sans-led typography with strong headline contrast

### Public portfolio defaults

- Readability first, motion second
- Projects and experience should feel like narrative sections, not generic cards
- Use motion to stage attention, reveal transitions, and enrich hierarchy

### Premium template direction

- Darker, more cinematic, more expressive
- More advanced motion systems are allowed
- Still must meet accessibility, responsiveness, and hiring-readability standards

## Information Architecture

### Primary product navigation

- Dashboard
- Edit Portfolio
- Templates
- Analytics
- Billing
- Settings

Do not overload primary navigation with admin-style or configuration-heavy destinations.

### Onboarding flow

- Welcome
- Choose source
- Import processing
- Section-by-section verification
- Starter template choice
- Preview
- Publish

Onboarding should feel like a single guided outcome, not a settings labyrinth.

## Navigation Rules

- Keep the hierarchy shallow and predictable
- Never force users into a freeform builder before they have a complete first publish
- Use explicit `Back`, `Continue`, `Skip where valid`, and `Save and continue` controls
- Do not hide key workflow actions behind hover-only behavior
- Preserve draft state when users leave and return to the wizard or editors

## Onboarding UX Standards

### Flow model

- Use a guided wizard as the primary phase 1 authoring experience
- Split verification by section
- Always show progress
- Use a verification hub after import so users understand what still needs attention

### Verification behavior

- Highlight low-confidence imported fields clearly
- Show confidence flags at field or section level
- Prioritize review for profile, experience, and projects
- Make edits immediate and lightweight
- Do not force users through unnecessary fields before first publish

### Content order

- Profile
- Experience
- Projects
- Education
- Skills
- Links
- Template
- Preview and publish

## Form And Editing Standards

- Every field requires a visible label
- Use helper text where the desired output is not obvious
- Validate on blur, not on every keystroke
- Show errors inline near the affected input
- Group repeatable content like experience and projects in compact summary cards with drill-in editing
- Support add, edit, delete, reorder, and preview-friendly summaries
- Use drawers or contained panels more often than disruptive full-screen modals
- Use confirmation dialogs only for destructive actions

## Dashboard UX Standards

The dashboard should answer three questions immediately:

1. Is the portfolio live?
2. What should the user improve next?
3. Is the portfolio performing?

### Required dashboard blocks

- Publish status and live URL
- Completion score
- Latest draft update state
- Recent views
- Upgrade prompt if on free tier
- Next best actions

### Avoid

- Dense admin analytics grids
- More than one primary CTA
- Generic SaaS dashboard clutter with low-value cards

## Template Selection UX

Template selection must feel curated and decision-light.

Each template card should show:

- Live preview
- Best-for label
- Free or Pro status
- Motion profile
- Compatible sections

The first publish experience should steer users toward a safe default template rather than asking them to choose from a wall of equal-looking options.

## Preview And Publish UX

- Draft and live states must be visually distinct
- Preview should look and behave close to the public portfolio output
- Publish should be explicit, not automatic
- Publish summary should show:
  - target URL
  - template name
  - version outcome
  - key changes
- Publish success should feel celebratory but short
- Republish should reuse the same mental model as first publish

## Motion Guidelines

Use `framer-motion` intentionally.

### Allowed motion surfaces

- Wizard step transitions
- Verification reveal and save states
- Template preview switching
- Publish-success transitions
- Dashboard microinteractions
- Public template storytelling transitions

### Timing and behavior

- Microinteractions: 150ms to 300ms
- Larger view transitions: up to 400ms
- Use transform and opacity only
- Use ease-out for entry and ease-in for exit
- Exit transitions should be faster than entry transitions
- All motion must be interruptible
- Respect `prefers-reduced-motion`

### Do not use

- Decorative infinite looping motion outside loaders
- Layout-shifting animations
- Motion that delays primary actions
- Motion that hides important content until too late

## Accessibility Rules

- Minimum 4.5:1 contrast for core text
- Visible keyboard focus states everywhere
- Minimum 44x44 click and tap targets
- Full keyboard navigation in dashboard and editors
- Screen-reader-readable labels for icon-only actions
- Motion alternatives or reduction when reduced motion is requested
- No information conveyed by color alone
- Clear error recovery paths for upload, parsing, and publish failures

## Responsive Standards

Test and design for:

- 375px
- 768px
- 1024px
- 1440px

### Mobile priorities

- Onboarding must remain fully usable on mobile
- Dashboard must keep publish status and next actions above the fold
- Public portfolios must preserve narrative flow and readability
- Avoid horizontal scrolling
- Use `min-height: 100dvh` patterns rather than brittle `100vh` assumptions

## Component Standards

### Buttons

- One clear primary CTA per screen
- Secondary actions visibly subordinate
- Disabled state must look disabled and remain non-interactive
- Loading buttons must show progress and avoid double submit

### Cards

- Use cards for grouped information, not for every single content block
- Card styling should follow one consistent radius and elevation scale
- Cards should not become a substitute for hierarchy

### Inputs

- Use semantic types
- Show helper copy for complex fields
- Keep labels outside placeholders

### Status chips and badges

- Use them sparingly for confidence, free/Pro, draft/live, and template states
- Avoid rainbow status noise

## Public Portfolio UX Rules

- Career information must remain scannable by humans and recruiters
- Projects should have direct paths to live links and deeper detail
- Experience should support narrative structure, not just timeline dumping
- Contact and call-to-action areas should remain obvious and trustworthy
- Motion can enrich but must never hide critical content

## Anti-Patterns

- Building the phase 1 editor like a no-code page builder
- Overusing gradients in the core product shell
- Using flashy motion to compensate for weak information architecture
- Showing one giant unstructured form during onboarding
- Using analytics-heavy or admin-heavy layouts for normal users
- Turning template choice into a marketplace wall
- Auto-publishing edits directly to live

## Quality Checklist

- Does the screen have exactly one primary action?
- Can the user tell whether they are editing draft or live content?
- Can low-confidence imported data be identified immediately?
- Does the screen preserve readability with motion turned down?
- Does the mobile layout preserve the same core path as desktop?
- Would a recruiter-facing user trust the experience?
