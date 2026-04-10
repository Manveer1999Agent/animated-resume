# Animated Resume Supabase Schema And RLS

Related docs:
- [Data Model And Contracts](./2026-04-11-data-model-and-contracts.md)
- [Publish Pipeline](./2026-04-11-publish-pipeline.md)

## Supabase Responsibilities

Supabase is the platform system of record for:

- authentication
- portfolio and draft data
- template metadata
- published artifact metadata
- media storage
- analytics summaries
- subscription state mirrors

Supabase should not be used as the place where public pages are assembled on every request. The public site is driven by published artifacts and active version metadata.

## Proposed Schema

### Identity and ownership

- `profiles`
- `accounts`
- `account_memberships`

### Core user content

- `portfolios`
- `portfolio_drafts`
- `portfolio_section_states`
- `experience_items`
- `project_items`
- `project_links`
- `education_items`
- `skill_groups`
- `skill_items`
- `social_links`
- `media_assets`
- `seo_settings`

### Publishing

- `portfolio_versions`
- `draft_snapshots`
- `published_artifacts`
- `publish_jobs`
- `subdomain_bindings`

### Import and operational tracking

- `import_jobs`
- `job_events`

### Templates

- `template_catalog`
- `template_releases`
- `template_release_requirements`

### Monetization and analytics

- `subscriptions`
- `subscription_events`
- `analytics_daily`
- `analytics_referrers_daily`

## Multi-Portfolio-Ready Launch Shape

The backend schema should support more than one portfolio per account, but the launch UI should expose only one visible portfolio for normal users.

That means:

- each new user should receive one default personal account at signup
- `profiles` should not own exactly one portfolio via a hard one-to-one rule
- `portfolios` should reference `account_id`
- subscriptions should belong to accounts
- entitlement logic should gate visible portfolio creation later

## Suggested Table Notes

### `profiles`

- auth user id
- display name
- avatar
- onboarding status
- platform admin flag

### `accounts`

- account type, default `personal`
- display name
- bootstrap creator profile id used only when provisioning the default personal account at signup

### `account_memberships`

- account id
- profile id
- role
- joined at

### `portfolios`

- owner account id
- slug
- display name
- status
- active draft id
- active published version id

### `portfolio_drafts`

- portfolio id
- schema version
- profile payload summary
- completion score
- source type
- source confidence
- last verified at
- theme settings

### `experience_items` and related content tables

- draft id foreign key
- explicit ordering index
- soft-delete support if needed

### `portfolio_versions`

- portfolio id
- draft snapshot id
- template release id
- status
- version number
- published at
- activated at

### `draft_snapshots`

- portfolio id
- captured from draft id
- normalized draft json
- schema version
- checksum
- created at

### `published_artifacts`

- version id
- manifest storage path
- asset bundle storage path
- checksum
- build metadata

### `subdomain_bindings`

- portfolio id
- hostname
- active artifact id
- status

`subdomain_bindings` remain the database source of truth, but publish activation should mirror the active route state into an edge-readable route cache so public requests avoid request-time Postgres reads.

## RLS Strategy

### User-facing content tables

Apply RLS to all user-owned tables so that users can only read and write rows for portfolios they own or are explicitly granted access to.

Core rule:

- authenticated user can access rows only if they belong to an account linked to that user through membership, and that account owns the target portfolio

### Admin-only tables and actions

Use role-based access control through `profiles.is_admin` or an equivalent roles table. Admin routes should still pass through backend authorization checks; do not rely on client-side hiding.

### Published metadata

- Public portfolio artifact delivery should not require broad read access to draft tables
- Expose only the minimal active-version metadata needed for public resolution
- Keep private draft content and job detail tables protected behind authenticated access
- Public route resolution should read from an edge route cache populated by publish activation, not from direct browser access to Postgres

## Storage Layout

Recommended storage buckets:

- `avatars`
- `portfolio-media`
- `portfolio-artifacts`
- `preview-artifacts`
- `admin-seed-assets`

Recommended object path conventions:

- `avatars/{profileId}/{assetId}`
- `portfolio-media/{portfolioId}/{assetId}`
- `portfolio-artifacts/{portfolioId}/{versionId}/manifest.json`
- `portfolio-artifacts/{portfolioId}/{versionId}/assets/...`
- `preview-artifacts/{portfolioId}/{previewId}/...`

## Auth Model

- Supabase Auth handles user identity
- Web app uses Supabase session for client auth state
- Express API validates user sessions or service tokens
- Background publish and import jobs use service-role access through backend-controlled secrets, never the client

## Analytics Shape

Do not write one database row per public page view if avoidable.

Preferred approach:

- edge or runtime layer emits lightweight events
- aggregation job writes daily rollups to `analytics_daily`
- optional referrer rollups go to `analytics_referrers_daily`

Launch analytics should focus on:

- total views
- views by day
- last visit time
- top referrers if available

## Subscription Data Model

Keep Stripe as billing source of truth but mirror product-relevant state in Supabase at the account level.

Recommended fields:

- provider customer id
- provider subscription id
- tier
- status
- current period start
- current period end
- cancel at period end

## Security Rules

- service-role credentials live only in the backend runtime
- no direct client writes to admin-only tables
- no public client access to draft, subscription, or internal job tables
- published artifact paths should be read-only for public delivery
- admin operations should be logged

## Minimum RLS Outcomes To Verify

- user A cannot read or mutate user B draft rows
- user A cannot access user B publish jobs
- free user cannot modify Pro-only template assignments through direct API misuse
- admin-only tables remain inaccessible without admin role
