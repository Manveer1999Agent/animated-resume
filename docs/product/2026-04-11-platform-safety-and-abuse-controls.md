# Animated Resume Platform Safety And Abuse Controls

Related docs:
- [Platform Design Spec](../specs/2026-04-11-animated-resume-platform-design.md)
- [Operations And Environments](../architecture/2026-04-11-operations-and-environments.md)

## Purpose

Animated Resume publishes user-controlled public portfolio sites. That creates abuse risks which need explicit product and operational controls.

## Primary Abuse Risks

- spam portfolios
- phishing or impersonation pages
- abusive or illegal public content
- malicious links in project/contact sections
- automated account creation
- asset-upload abuse
- slug squatting and brand impersonation

## Safety Principles

1. `Safe by default`
   Public publishing should be constrained by the product’s structured model.
2. `Human-readable moderation`
   Admin must be able to inspect relevant portfolio, publish, and account data quickly.
3. `Strong boundaries`
   Public portfolio publishing is not a freeform raw HTML host.
4. `Clear escalation`
   The product should support report, inspect, suspend, and takedown flows.

## Product-Level Controls

### Structured content model

The structured portfolio model is already a safety control:

- no arbitrary HTML editing
- no unrestricted script injection
- templates control presentation

### URL and slug controls

Before launch, define:

- reserved words
- profanity filters
- minimum and maximum slug lengths
- uniqueness rules
- rename policy

Recommended phase 1 default:

- slugs are lowercase alphanumeric plus hyphen only, with a defined minimum and maximum length
- reserve platform-critical slugs like `admin`, `api`, `support`, `pricing`, `login`, `signup`
- block suspicious impersonation slugs where feasible
- slugs are editable until first successful publish
- after first publish, slug changes are locked in phase 1
- redirects for renamed slugs are deferred to a later phase

### Link controls

- validate link schemes
- block obviously unsafe protocols
- consider warning or review paths for suspicious outbound links

### Upload controls

- limit file size
- allow only approved file types
- scan or validate image/document uploads where practical
- rate limit uploads

## Platform-Level Controls

### Rate limiting

Add limits for:

- auth endpoints
- import endpoints
- publish endpoints
- public reporting endpoints

### Abuse detection

Monitor for:

- repeated account creation from the same source
- repeated publish attempts with suspicious content
- abnormal outbound-link patterns
- excessive upload attempts

### Moderation actions

Admin should be able to:

- inspect a public portfolio
- inspect draft and publish metadata
- suspend publishing
- disable a live subdomain
- flag an account for review

## Reporting Flow

Phase 1 should include a lightweight reporting path with:

- report abuse entry point
- category selection
- optional notes
- internal admin queue for review

## SEO And Crawling Safety

Phase 1 should define baseline public indexing rules:

- live published portfolios may be indexable
- drafts and previews must not be indexable
- suspended or removed sites should not remain publicly discoverable through active routing

## Billing And Abuse

Paid status should not be treated as a trust signal by itself.

Pro accounts can still abuse the platform and must remain subject to:

- link safety checks
- moderation review
- publishing restrictions when necessary

## Admin Safety Surface

The admin console should eventually include:

- suspicious-account overview
- publish-job inspection
- domain and slug inspection
- report queue
- account suspension state

## Launch Minimum

Before public launch, the product should have at least:

- reserved slugs
- file and link validation
- rate limiting on auth/import/publish endpoints
- admin ability to disable a public portfolio
- basic abuse review path

## Deferred But Important

- automated trust scoring
- richer moderation queues
- stricter domain reputation checks
- bot detection upgrades
