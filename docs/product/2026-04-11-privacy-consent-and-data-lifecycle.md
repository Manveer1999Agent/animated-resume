# Animated Resume Privacy, Consent, And Data Lifecycle

Related docs:
- [Platform Design Spec](../specs/2026-04-11-animated-resume-platform-design.md)
- [Supabase Schema And RLS](../architecture/2026-04-11-supabase-schema-and-rls.md)

## Purpose

This document defines how Animated Resume should handle user consent, imported data, uploads, deletion, and lifecycle expectations.

## Core Privacy Position

Animated Resume should minimize retained data and avoid storing raw AI parse output as product data.

The retained source of truth is the normalized draft model plus lightweight metadata needed to operate the product.

## Consent Requirements

Before running AI parsing on an uploaded resume, the user should be informed that:

- the resume will be processed to generate structured portfolio data
- extracted data may contain mistakes and must be verified
- imported content will be mapped into editable profile sections

LinkedIn basic connect should clearly state that phase 1 only uses basic identity information and does not guarantee full profile import.

## Data Retention Rules

### Retain

- normalized draft content
- publish/version metadata
- template selection
- lightweight import metadata such as source type and confidence summary
- subscription state mirror
- aggregate analytics

### Do not retain as product data

- raw Gemini structured output
- raw parser snapshots
- LinkedIn raw payload snapshots beyond what is needed in-flight

### Resume uploads

Resume files should be treated as transient processing assets by default.

Recommended rule:

- store only long enough to complete import processing and immediate retry windows
- delete automatically after successful mapping or after a short expiration window

## User Verification Principle

Because raw import artifacts are not retained, the verification UX becomes the user’s control point.

The product must:

- highlight low-confidence sections
- make correction simple
- avoid pretending the import is authoritative

## Account Deletion

Phase commitment:

- phase 1: support-assisted account deletion workflow
- phase 2: self-serve deletion request and tracking

The deletion lifecycle model should be:

- user requests deletion
- active hosted portfolio is disabled or unpublished
- drafts, portfolio content, and user-owned assets are removed according to policy
- subscription handling follows billing-provider rules
- analytics remain only if legally and contractually acceptable in anonymized aggregate form

## Data Export

Phase commitment:

- phase 1: internal support-assisted export if required
- phase 2: self-serve structured export

Users should be able to export:

- normalized draft data
- public portfolio metadata
- published-version history metadata

Export format should be structured JSON, with optional future resume-like PDF or markdown export layered later.

## Public Visibility Rules

- draft data is private
- preview output is private or access-controlled
- only the active published artifact is public

Users should always be able to tell whether they are editing private draft content or public live content.

## Upload And Asset Lifecycle

- avatars and portfolio media remain user-owned product assets while the account is active
- preview artifacts should expire automatically
- published artifacts remain until replaced, unpublished, or deleted with the portfolio

## Legal And Policy Surface

The product should plan to ship:

- Privacy Policy
- Terms of Service
- Acceptable Use Policy

These are not implemented in the current docs, but the product design assumes they will exist before broad public launch.

## Operational Requirements

- document upload-expiration policy
- document deletion behavior
- ensure backup/restore policy does not accidentally conflict with user-deletion promises
- ensure admin tooling does not expose more user data than necessary

## Open Product Guardrails

These are defaults the implementation should preserve:

- do not add hidden retention of raw AI parse payloads later without updating this policy
- do not quietly widen LinkedIn collection scope beyond the disclosed launch behavior
- do not treat public portfolio analytics as permission to track personal data unnecessarily
