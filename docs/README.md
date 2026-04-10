# Animated Resume Documentation

This workspace contains the product, design, architecture, and execution documents for the Animated Resume platform.

Primary repo entrypoint:
- [../README.md](../README.md)

## Reading Order

1. [Platform Design Spec](./specs/2026-04-11-animated-resume-platform-design.md)
2. [Product UI/UX Guidelines](./ui-ux/2026-04-11-product-ui-ux-guidelines.md)
3. [System Architecture](./architecture/2026-04-11-system-architecture.md)
4. [Flow Diagrams](./architecture/2026-04-11-flow-diagrams.md)
5. [Data Model And Contracts](./architecture/2026-04-11-data-model-and-contracts.md)
6. [Supabase Schema And RLS](./architecture/2026-04-11-supabase-schema-and-rls.md)
7. [Publish Pipeline](./architecture/2026-04-11-publish-pipeline.md)
8. [Operations And Environments](./architecture/2026-04-11-operations-and-environments.md)
9. [Privacy, Consent, And Data Lifecycle](./product/2026-04-11-privacy-consent-and-data-lifecycle.md)
10. [Platform Safety And Abuse Controls](./product/2026-04-11-platform-safety-and-abuse-controls.md)
11. [Phased Execution Roadmap](./product/2026-04-11-phased-execution-roadmap.md)
12. Plans in [`../plans/`](../plans/)

## Document Map

| Area | File | Purpose |
| --- | --- | --- |
| Product spec | [`specs/2026-04-11-animated-resume-platform-design.md`](./specs/2026-04-11-animated-resume-platform-design.md) | Product scope, target audience, screens, monetization, and phase summary |
| UI/UX | [`ui-ux/2026-04-11-product-ui-ux-guidelines.md`](./ui-ux/2026-04-11-product-ui-ux-guidelines.md) | Visual direction, interaction standards, accessibility, motion, and component rules |
| Architecture | [`architecture/2026-04-11-system-architecture.md`](./architecture/2026-04-11-system-architecture.md) | Runtime topology, service boundaries, deployment recommendations, and operational split |
| Flows | [`architecture/2026-04-11-flow-diagrams.md`](./architecture/2026-04-11-flow-diagrams.md) | End-to-end Mermaid diagrams for onboarding, publishing, billing, admin operations, and release lifecycles |
| Contracts | [`architecture/2026-04-11-data-model-and-contracts.md`](./architecture/2026-04-11-data-model-and-contracts.md) | Canonical entities and contracts used across import, editing, templates, and publishing |
| Database | [`architecture/2026-04-11-supabase-schema-and-rls.md`](./architecture/2026-04-11-supabase-schema-and-rls.md) | Supabase table design, RLS approach, storage layout, and tenant isolation rules |
| Publishing | [`architecture/2026-04-11-publish-pipeline.md`](./architecture/2026-04-11-publish-pipeline.md) | Draft-to-live artifact flow, rollback model, cache invalidation, and failure handling |
| Operations | [`architecture/2026-04-11-operations-and-environments.md`](./architecture/2026-04-11-operations-and-environments.md) | Environment strategy, CI/CD, migrations, workers, alerts, backups, and operational readiness |
| Privacy | [`product/2026-04-11-privacy-consent-and-data-lifecycle.md`](./product/2026-04-11-privacy-consent-and-data-lifecycle.md) | Consent model, upload retention, data deletion, export expectations, and lifecycle rules |
| Safety | [`product/2026-04-11-platform-safety-and-abuse-controls.md`](./product/2026-04-11-platform-safety-and-abuse-controls.md) | Abuse prevention, reporting, moderation, slug/domain safety, and platform protections |
| Roadmap | [`product/2026-04-11-phased-execution-roadmap.md`](./product/2026-04-11-phased-execution-roadmap.md) | Release sequencing, phase entry/exit criteria, risks, and monetization milestones |
| Execution | [`../plans/`](../plans/) | Detailed implementation plans by phase and subsystem |

## Current Source Of Truth

- Product intent and scope live in the design spec.
- Product shell and public experience rules live in the UI/UX guidelines.
- Runtime, data, and publishing behavior live in the architecture docs.
- Build order and release boundaries live in the roadmap and phase plans.

## Glossary

- `Draft`: the editable normalized portfolio state inside the authenticated product.
- `Published version`: a versioned artifact created from a draft and a specific template release.
- `Published artifact`: the compiled, immutable output served to the public subdomain.
- `Template release`: a versioned internal template package with known section support and compatibility metadata.
- `Hosted subdomain`: the default public URL format, such as `username.product.com`.
- `Pro entitlement`: paid capabilities such as premium templates, branding removal, richer analytics, and later custom domains or multi-portfolio support.
