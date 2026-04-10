# Animated Resume Flow Diagrams

Related docs:
- [System Architecture](./2026-04-11-system-architecture.md)
- [Data Model And Contracts](./2026-04-11-data-model-and-contracts.md)
- [Publish Pipeline](./2026-04-11-publish-pipeline.md)
- [Phased Execution Roadmap](../product/2026-04-11-phased-execution-roadmap.md)

This document consolidates the major product and platform flows into Mermaid diagrams so the delivery model, user lifecycle, and operational paths are easy to review without reading the full spec line-by-line.

## 1. User Journey: First Visit To Live Portfolio

```mermaid
flowchart LR
    A[Landing Page] --> B[Sign Up Or Sign In]
    B --> C[Choose Import Source]
    C --> D[Resume Upload]
    C --> E[LinkedIn Basic Connect]
    C --> F[Manual Start]
    D --> G[Gemini Mapping]
    E --> H[Identity Prefill Mapping]
    F --> I[Empty Draft]
    G --> J[Normalized Draft]
    H --> J
    I --> J
    J --> K[Verification Hub]
    K --> L[Profile Review]
    K --> M[Experience Review]
    K --> N[Projects Review]
    K --> O[Education Skills Links]
    L --> P[Starter Template Selection]
    M --> P
    N --> P
    O --> P
    P --> Q[Preview]
    Q --> R[Publish]
    R --> S[Live Hosted Portfolio]
    S --> T[Return To Dashboard]
```

## 2. Import And Normalization Flow

```mermaid
flowchart TD
    A[User Chooses Import Source] --> B{Source Type}
    B -->|Resume| C[Upload Resume File]
    B -->|LinkedIn Basic| D[Receive Identity Payload]
    B -->|Manual| E[Create Empty Draft]
    C --> F[Gemini Parse Request]
    F --> G[Structured Extraction Response]
    G --> H[Backend Mapping Layer]
    D --> H
    E --> I[Normalized Draft Seed]
    H --> I
    I --> J[Store Draft Rows]
    J --> K[Compute Confidence Summary]
    K --> L[Verification Hub]
    L --> M[Section Editing]
    M --> N[Updated Normalized Draft]
```

## 3. Draft, Preview, Publish, And Rollback Flow

```mermaid
flowchart TD
    A[Draft Updated] --> B[Validate Required Fields]
    B --> C{Template Compatible}
    C -->|No| D[Return Publish Error]
    C -->|Yes| E[Create Immutable Draft Snapshot]
    E --> F[Compile Template Props]
    F --> G[Generate Preview Artifact]
    G --> H[Preview Screen]
    H --> I{User Publishes}
    I -->|No| J[Continue Editing Draft]
    I -->|Yes| K[Create Publish Job]
    K --> L[Generate Published Artifact]
    L --> M[Persist Artifact Metadata]
    M --> N[Create Portfolio Version]
    N --> O[Activate Live Version]
    O --> P[Sync Edge Route Cache]
    P --> Q[Invalidate Hosted Subdomain Cache]
    Q --> R[Serve New Live Portfolio]
    R --> S{Rollback Needed}
    S -->|No| T[Stay On Active Version]
    S -->|Yes| U[Select Prior Successful Version]
    U --> V[Re-activate Prior Version]
    V --> W[Sync Edge Route Cache]
    W --> X[Invalidate Cache Again]
    X --> Y[Serve Rolled Back Portfolio]
```

## 4. Billing And Entitlement Flow

```mermaid
flowchart LR
    A[Free User Hits Pro Feature] --> B[Upgrade Prompt]
    B --> C[Create Stripe Checkout Session]
    C --> D[Stripe Checkout]
    D --> E[Webhook To API]
    E --> F[Validate Event Idempotently]
    F --> G[Update Subscription Mirror]
    G --> H[Recompute Entitlements]
    H --> I[Unlock Pro Features]
    I --> J[Premium Templates]
    I --> K[Branding Removal]
    I --> L[Advanced Analytics]
    I --> M[Future Custom Domains And Multi-Portfolio]
```

## 5. Admin Template Release Lifecycle

```mermaid
flowchart TD
    A[Internal Template Work] --> B[Create Template Release Draft]
    B --> C[Attach Compatibility Rules]
    C --> D[Seed Preview Data]
    D --> E[Internal Preview Review]
    E --> F{Approved}
    F -->|No| G[Revise Release]
    G --> C
    F -->|Yes| H[Publish Template Release]
    H --> I[Visible In Template Catalog]
    I --> J[Used In Preview And Publish]
    J --> K{Needs Replacement}
    K -->|No| L[Remain Active]
    K -->|Yes| M[Create New Release]
    M --> N[Deprecate Old Release For New Publishes]
    N --> O[Keep Existing Live Portfolios Stable]
```

## 6. Operational Job Visibility Flow

```mermaid
flowchart LR
    A[Import Or Publish Request] --> B[Create Job Record]
    B --> C[Run Worker Stage]
    C --> D[Append Structured Job Event]
    D --> E{Success}
    E -->|No| F[Mark Failed With Error Code]
    E -->|Yes| G[Mark Completed]
    F --> H[Visible In Admin Jobs View]
    G --> H
    H --> I[Support Or Retry Decision]
```

## 7. Phase Delivery Flow

```mermaid
flowchart LR
    A[Phase 1 Publishable Core] --> B[Phase 2 Workspace And Operations]
    B --> C[Phase 3 Premium Scale]

    A1[Auth + Wizard + Publish + Billing] --> A
    B1[Dashboard + Rollback + Template Lifecycle] --> B
    C1[Custom Domains + Multi-Portfolio + Premium Packs] --> C
```

## Usage Notes

- Use these diagrams as the visual companion to the architecture and roadmap docs.
- Keep terminology aligned with the canonical contract docs:
  - `draft`
  - `template release`
  - `portfolio version`
  - `published artifact`
- Update this file whenever a flow changes in a way that impacts product behavior or operational ownership.
