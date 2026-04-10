# Animated Resume Platform Design

Related docs:
- [UI/UX Guidelines](../ui-ux/2026-04-11-product-ui-ux-guidelines.md)
- [System Architecture](../architecture/2026-04-11-system-architecture.md)
- [Phased Execution Roadmap](../product/2026-04-11-phased-execution-roadmap.md)

## Product Summary

Animated Resume is a portfolio SaaS that converts structured career information into interactive, animated, recruiter-friendly portfolio websites. The product uses a guided import-and-verification experience, internally curated templates, and an explicit publish workflow to create versioned public portfolio artifacts.

The product is not a generic website builder. It is a portfolio platform with opinionated data structures, curated templates, and a publishing model that prioritizes quality, speed, scalability, and cost control.

## Goals

1. Help users publish an interactive portfolio from resume-quality information without requiring design or web-development skill.
2. Create a monetizable product with a free-to-Pro conversion path from phase 1.
3. Deliver public portfolio traffic through versioned published artifacts instead of live-rendered editor data.
4. Keep the first release understandable and recruiter-safe while leaving room for creator-grade premium templates later.

## Target Audience

### Default launch audience

- Professionals and job seekers
- Early-career to mid-career users who need a polished public portfolio quickly
- Users who want recruiter-friendly storytelling, not a fully custom website editor

### Secondary audiences

- Freelancers and creators
- Students and early-career candidates

The product architecture should support these users, but onboarding defaults, starter copy, and starter templates should optimize for professionals first.

## Product Principles

1. `Structured first`
   The system should be driven by normalized portfolio data, not ad hoc layout editing.
2. `Draft before live`
   Users edit drafts and explicitly publish. Live content should never change silently.
3. `Curated, not chaotic`
   Templates are internally created and versioned. The product is not a marketplace in phase 1.
4. `Motion with purpose`
   Animation should guide, emphasize, and tell a story. It must not distract or confuse.
5. `Fast public delivery`
   Published portfolios should be served from immutable, cacheable artifacts.

## Core User Outcomes

- Import resume or connect LinkedIn basic identity.
- Verify and clean up imported information.
- Select a starter template.
- Preview and publish a live portfolio.
- Return to update the draft, republish, and track basic analytics.

## Product Surfaces

### 1. Marketing and acquisition

- Landing
- How it works
- Template gallery
- Template detail
- Examples and showcase
- Pricing
- Auth entry

### 2. Onboarding and intake

- Welcome and path selection
- Resume upload
- LinkedIn basic connect
- Import processing
- Verification review
- Section-based manual editing
- Starter template selection
- First publish readiness

### 3. Authenticated user workspace

- Dashboard
- Portfolio overview
- Editor summary
- Section editor
- Template selector
- Theme and motion settings
- Preview
- Publish flow
- Published versions
- Analytics
- Billing
- Account settings

### 4. Admin console

- Admin overview
- Users
- Templates
- Template releases
- Import jobs
- Publish jobs
- Billing overview
- Feature flags
- Support and moderation tools

### 5. Public portfolio surface

- Portfolio home
- Project detail
- Experience timeline
- About
- Resume and download
- Contact and call-to-action sections

## Screen Inventory

### Marketing

- Landing page
- Template gallery
- Template detail page
- Showcase page
- Pricing page
- Sign in
- Sign up

### Onboarding wizard

- Welcome
- Choose import source
- Resume upload
- LinkedIn basic connect
- Import processing
- Verification hub
- Profile step
- Experience step
- Projects step
- Education step
- Skills step
- Links step
- Starter template step
- Preview and readiness step
- Publish success step

### Workspace

- Dashboard
- Portfolio summary
- Section editor list
- Experience editor
- Projects editor
- Education editor
- Skills editor
- Links editor
- Theme settings
- Template selector
- Preview
- Publish flow
- Version history
- Analytics
- Billing
- Settings

### Admin

- Overview
- Template catalog
- Template release detail
- User management
- Import jobs
- Publish jobs
- Billing and subscriptions
- Feature flags

## UX Direction

- Product shell baseline: editorial, structured, premium, calm
- Gradient accents: used selectively for hero surfaces, pricing highlights, and upgrade moments
- Darker, more expressive motion language: reserved for premium public templates rather than the core app shell
- Onboarding model: guided wizard
- Post-onboarding model: structured workspace, not freeform canvas editing

## Data Handling Decisions

- Retain only the normalized draft model plus lightweight metadata such as source type, confidence, timestamps, and completion state
- Do not retain raw Gemini output as a product artifact
- Do not design phase 1 around universal LinkedIn full-profile portability
- Treat resume parsing and identity prefill as transient processing inputs into the normalized draft layer

## Template Strategy

- Internally curated template library only in phase 1
- Templates are versioned, compatibility-aware renderer packages
- Templates consume structured contract data, not arbitrary layout JSON
- 21st.dev components are design/building references for internal template composition, not direct end-user runtime assembly

## Publishing Model

- The system uses an explicit `draft -> preview -> publish` workflow
- Each publish creates a versioned public artifact
- Hosted subdomains are the default public-delivery mechanism
- Live traffic should resolve to the active published artifact, not a live editor dataset

## Launch Ownership Model

- Each new user gets one default personal account at signup
- Portfolios belong to accounts, not directly to profiles
- Profiles represent user identity
- Account memberships represent who can access an account
- Subscriptions and entitlements are account-level so future multi-member or team ownership does not require a billing rewrite

Phase 1 still behaves like a one-user product in the UX, but the ownership model should be future-proof from the start.

## Hosted URL Policy

- Each portfolio has a globally unique hosted slug
- Reserved words must be blocked
- Slugs are editable until the first successful publish
- After first publish, slugs are locked in phase 1 to avoid redirect and SEO ambiguity
- Support-assisted slug rename with redirects can be introduced in a later phase

## Monetization Model

Phase 1 launches with freemium and Pro tiers.

### Free

- One visible portfolio
- Hosted subdomain
- Limited starter templates
- Product branding on public portfolio
- Basic analytics

### Pro

- Premium templates
- Branding removal
- Richer analytics
- Access path for future custom domains
- Access path for future multi-portfolio support
- Access path for premium motion and template packs

## Hosting Recommendation

- Web product shell and marketing: Vercel
- Public portfolio delivery and subdomain routing: edge-friendly static delivery on Vercel with published artifact resolution
- Backend API: managed Express deployment, recommended on Render
- Database, storage, and auth: Supabase

This split keeps the authenticated editing app, API workload, and public portfolio traffic from competing for the same runtime responsibilities.

## Phase Summary

### Phase 1

- Marketing site
- Auth
- Personal account bootstrap on signup
- Guided onboarding wizard
- Resume upload and Gemini mapping
- LinkedIn basic prefill
- Normalized draft CRUD
- Structured section editors
- Starter templates
- Preview and publish flow
- Hosted subdomains
- Stripe-backed free and Pro billing
- Basic analytics
- Admin basics

### Phase 2

- Stronger workspace dashboard
- Published version history and rollback
- Better media management
- More templates
- Template release workflow improvements
- Improved retention and lifecycle UX

### Phase 3

- Custom domains
- Premium motion and template packs
- Visible multi-portfolio Pro UX
- Advanced SEO
- Deeper analytics and lead capture
- Optional studio expansion beyond the wizard-first flow

## Success Criteria

- A new user can publish a live portfolio without needing manual HTML editing.
- Publish is explicit, understandable, and reversible.
- Public portfolio performance stays fast and cost-efficient under read-heavy traffic.
- The free-to-Pro boundary is visible and credible from launch.
- Product shell UX remains clear and trustworthy for career-focused users.

## Non-Goals For Launch

- General-purpose drag-and-drop website building
- User-generated template marketplace
- Real-time live editing of public sites without publishing
- Full custom domain support
- Visible multi-portfolio authoring in the initial UX
