# Animated Resume

Animated Resume is a production-focused SaaS product for turning resume or LinkedIn-style professional data into polished, animated, recruiter-friendly portfolio sites.

The product objective is clear:

- let users import or enter career data once
- normalize that data into a structured draft model
- help users verify and improve it through a guided product experience
- publish fast, interactive portfolio sites on hosted subdomains
- monetize through a free-to-Pro model without compromising scalability or cost efficiency

This repository is currently the planning and architecture workspace for the product. It contains the source-of-truth documentation needed before implementation starts.

## Product Direction

- Audience first: professionals and job seekers
- Product shape: guided onboarding plus structured editing, not a freeform site builder in phase 1
- Rendering model: curated internal templates fed by normalized draft data
- Delivery model: explicit draft -> preview -> publish -> versioned live artifact
- Platform priorities: scalable, cost-aware, secure, and moderation-ready

## Recommended Reading Order

1. [Documentation Index](./docs/README.md)
2. [Platform Design Spec](./docs/specs/2026-04-11-animated-resume-platform-design.md)
3. [Product UI/UX Guidelines](./docs/ui-ux/2026-04-11-product-ui-ux-guidelines.md)
4. [System Architecture](./docs/architecture/2026-04-11-system-architecture.md)
5. [Flow Diagrams](./docs/architecture/2026-04-11-flow-diagrams.md)
6. [Data Model And Contracts](./docs/architecture/2026-04-11-data-model-and-contracts.md)
7. [Supabase Schema And RLS](./docs/architecture/2026-04-11-supabase-schema-and-rls.md)
8. [Publish Pipeline](./docs/architecture/2026-04-11-publish-pipeline.md)
9. [Operations And Environments](./docs/architecture/2026-04-11-operations-and-environments.md)
10. [Privacy, Consent, And Data Lifecycle](./docs/product/2026-04-11-privacy-consent-and-data-lifecycle.md)
11. [Platform Safety And Abuse Controls](./docs/product/2026-04-11-platform-safety-and-abuse-controls.md)
12. [Phased Execution Roadmap](./docs/product/2026-04-11-phased-execution-roadmap.md)
13. [Phase Plans](#phase-plans)

## Full Documentation Map

### Core index

- [docs/README.md](./docs/README.md) - documentation entrypoint and glossary

### Product and design

- [docs/specs/2026-04-11-animated-resume-platform-design.md](./docs/specs/2026-04-11-animated-resume-platform-design.md) - product scope, audience, screens, monetization, and launch direction
- [docs/ui-ux/2026-04-11-product-ui-ux-guidelines.md](./docs/ui-ux/2026-04-11-product-ui-ux-guidelines.md) - shell and portfolio UX rules, motion standards, accessibility, and UI principles

### Architecture

- [docs/architecture/2026-04-11-system-architecture.md](./docs/architecture/2026-04-11-system-architecture.md) - system topology, runtime boundaries, deployment split, and request flows
- [docs/architecture/2026-04-11-flow-diagrams.md](./docs/architecture/2026-04-11-flow-diagrams.md) - Mermaid workflow diagrams for onboarding, publishing, billing, admin, and release progression
- [docs/architecture/2026-04-11-data-model-and-contracts.md](./docs/architecture/2026-04-11-data-model-and-contracts.md) - canonical contracts for drafts, templates, imports, publishing, and subscriptions
- [docs/architecture/2026-04-11-supabase-schema-and-rls.md](./docs/architecture/2026-04-11-supabase-schema-and-rls.md) - database structure, RLS strategy, storage layout, and tenant ownership model
- [docs/architecture/2026-04-11-publish-pipeline.md](./docs/architecture/2026-04-11-publish-pipeline.md) - immutable snapshot, artifact generation, activation, rollback, and cache behavior
- [docs/architecture/2026-04-11-operations-and-environments.md](./docs/architecture/2026-04-11-operations-and-environments.md) - environments, CI/CD, migrations, jobs, backups, alerts, and release operations

### Product policy and rollout

- [docs/product/2026-04-11-privacy-consent-and-data-lifecycle.md](./docs/product/2026-04-11-privacy-consent-and-data-lifecycle.md) - consent, transient upload handling, export/deletion expectations, and retention rules
- [docs/product/2026-04-11-platform-safety-and-abuse-controls.md](./docs/product/2026-04-11-platform-safety-and-abuse-controls.md) - abuse controls, moderation model, slug safety, and reporting/takedown rules
- [docs/product/2026-04-11-phased-execution-roadmap.md](./docs/product/2026-04-11-phased-execution-roadmap.md) - phase boundaries, dependencies, risks, and release sequencing

## Phase Plans

- [plans/2026-04-11-phase-1-foundation-and-auth.md](./plans/2026-04-11-phase-1-foundation-and-auth.md) - repo foundation, app shells, auth, shared config, and baseline verification
- [plans/2026-04-11-phase-1-onboarding-and-normalization.md](./plans/2026-04-11-phase-1-onboarding-and-normalization.md) - import flows, Gemini mapping, LinkedIn prefill, normalized draft CRUD, and verification UX
- [plans/2026-04-11-phase-1-templates-preview-and-publish.md](./plans/2026-04-11-phase-1-templates-preview-and-publish.md) - template catalog, preview pipeline, immutable snapshots, publish jobs, and hosted artifacts
- [plans/2026-04-11-phase-1-billing-analytics-and-admin.md](./plans/2026-04-11-phase-1-billing-analytics-and-admin.md) - free/Pro billing, entitlements, analytics baseline, and admin operations
- [plans/2026-04-11-phase-2-workspace-and-retention.md](./plans/2026-04-11-phase-2-workspace-and-retention.md) - richer dashboard, version history, rollback UX, lifecycle nudges, and retention improvements
- [plans/2026-04-11-phase-2-operations-and-template-lifecycle.md](./plans/2026-04-11-phase-2-operations-and-template-lifecycle.md) - template release management, compatibility policy, support tooling, and observability upgrades
- [plans/2026-04-11-phase-3-premium-scale-and-domains.md](./plans/2026-04-11-phase-3-premium-scale-and-domains.md) - custom domains, advanced SEO, premium packs, and scale/cost controls
- [plans/2026-04-11-phase-3-multi-portfolio-and-growth.md](./plans/2026-04-11-phase-3-multi-portfolio-and-growth.md) - visible multi-portfolio UX, growth loops, and broader monetization expansion

## Current Build Rule

Implementation should follow the documentation in this order:

- product spec and UI/UX docs define intent and experience
- architecture docs define contracts and system behavior
- roadmap defines release boundaries
- phase plans define execution order

If any plan conflicts with the spec or architecture, update the plan instead of drifting the product direction.

UI/UX Pilot Design:
https://uxpilot.ai/s/0645feb75ab795393cef7db0bb903aea
