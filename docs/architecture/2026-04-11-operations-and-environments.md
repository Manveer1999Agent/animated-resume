# Animated Resume Operations And Environments

Related docs:
- [System Architecture](./2026-04-11-system-architecture.md)
- [Publish Pipeline](./2026-04-11-publish-pipeline.md)
- [Phased Execution Roadmap](../product/2026-04-11-phased-execution-roadmap.md)

## Purpose

This document defines the production operations model for Animated Resume. It closes the gap between product architecture and actual deployable service ownership.

## Environment Strategy

Maintain at least three environments:

- `local`
- `staging`
- `production`

### Local

- developer machines
- local React and API services
- Supabase local or shared dev instance
- safe mock or sandbox integrations for Gemini and Stripe

### Staging

- production-like infrastructure
- test domains and sandbox billing
- seeded template catalog
- seeded admin accounts
- preview-ready publish flow

### Production

- real hosted domains
- real billing
- real public portfolio delivery
- stricter secrets and access controls

## Deployment Boundaries

### Web

- marketing and product shell deploy through Vercel
- PR previews enabled
- staging and production deployments isolated by environment variables and domain routing

### API

- Express service deployed to a managed backend runtime such as Render
- separate services for staging and production
- health endpoint required

### Worker Runtime

Import and publish processing should run in a dedicated background worker or queue-backed job runner, not only inside synchronous HTTP request lifecycles.

Recommended worker responsibilities:

- Gemini import orchestration
- preview artifact generation
- publish artifact generation
- analytics aggregation jobs
- cleanup jobs for expired previews

## Job Processing Model

Phase 1 should use a Postgres-backed job model with a dedicated worker service polling `import_jobs`, `publish_jobs`, and writing append-only `job_events`.

This avoids introducing a second queueing system before the product proves its operational shape while still keeping long-running work out of the request path.

Minimum required behavior:

- explicit job record on enqueue
- status transitions
- retry policy
- max-attempt policy
- terminal failure state
- inspectable event timeline

Recommended operational defaults:

- import jobs: retry up to 2 times for transient upstream failures
- publish jobs: retry up to 2 times for transient storage or worker failures
- retry backoff: 30 seconds then 120 seconds
- terminal states: `succeeded`, `failed`, `cancelled`
- no silent infinite retries
- failed jobs stay visible in admin

## Alerting And Observability

The system needs structured observability for production readiness.

### Logs

- API request logs
- import job logs
- publish job logs
- Stripe webhook logs
- domain verification logs later

### Metrics

- import success rate
- publish success rate
- average import duration
- average publish duration
- failed webhook count
- public portfolio request error rate

### Alerts

- sustained import failure spike
- sustained publish failure spike
- webhook processing failures
- subdomain resolution failures
- queue backlog growth beyond threshold

## CI/CD Expectations

Each merge to main should run:

- install
- lint
- typecheck
- unit tests
- API tests

For deployable branches and tags:

- build web
- build API
- verify environment variable presence
- run schema checks or migration validation

Recommended:

- GitHub Actions for CI
- environment-protected production deploys

## Database Migrations

Use a migration-driven schema workflow.

Rules:

- every schema change goes through versioned migrations
- staging migrations run before production
- rollback plan required for destructive changes
- seed data for templates and admin-safe test data should be reproducible

## Seed Data

Required seed sets:

- starter templates
- example portfolio records for internal preview
- admin user for staging
- billing-plan metadata

Keep seeds safe and synthetic. Do not use real user portfolio content.

## Backup And Recovery

### Database

- daily automated backups
- tested restore procedure
- clear owner for restore execution

### Artifact Storage

- artifact buckets should be durable
- live published artifacts should not depend on ephemeral preview storage
- preview artifacts may be pruned on a retention schedule

## Domain And Slug Operations

### Hosted subdomains

- enforce unique slug generation
- maintain reserved-word list
- define rename behavior before launch
- phase 1 default: slugs editable until first publish, then locked
- later phases may add support-assisted rename and redirect records

### Custom domains

- stage only in production-grade rollout
- require verification and explicit activation

## Security And Access

- production secrets managed by environment secret stores only
- least-privilege access for CI and runtime services
- admin operations behind explicit role checks
- no direct client use of privileged service tokens

## Release Checklist

Before production release:

- migrations tested in staging
- publish pipeline exercised end to end
- billing tested in sandbox and production-safe mode
- import failures visible in admin
- backups confirmed
- alerts configured
- environment variables documented

## Deferred But Not Optional

These can be phased, but they must exist before scale:

- Sentry or equivalent error aggregation
- queue lag dashboard
- runbooks for publish failures and billing issues
- incident owner list
