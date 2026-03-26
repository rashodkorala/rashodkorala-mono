export const PROJECT_MDX_TEMPLATE = `## What It Is

[One paragraph. What does this do? Who would use it? What does it replace or improve on?]

Example: "AetherLabs is a lab management platform for biotech startups. It replaces spreadsheet-based inventory tracking and gives lab managers a single place to track reagents, equipment bookings, and protocol versions."

---

## The Problem It Solves

[What specific frustration or gap triggered this? Be concrete — what was the before-state?]

Example: "Lab managers at small biotechs maintained 5+ spreadsheets and regularly missed reagent expiry dates. One pilot client lost $12k of reagents in a single month because nobody was tracking fridge failures."

---

## How It Works

[Technical overview. Architecture, data flow, key moving parts. Don't just list features — explain how they connect.]

Example: "The frontend is Next.js with real-time updates via Supabase's Postgres changes subscription. Each lab is isolated at the RLS level — no shared state between tenants. The equipment booking system uses a slot-based calendar backed by a Postgres range type to prevent double-booking..."

---

## Key Technical Decisions

[Why did you pick the stack you picked? What did you consider and reject? What tradeoffs did you consciously make?]

- [Decision 1] e.g., Supabase over Firebase — needed relational joins for equipment-protocol linkage; Firestore's document model didn't fit
- [Decision 2] e.g., Server components for the dashboard — avoided client-side loading states and halved the JS bundle
- [Decision 3] e.g., Skipped a dedicated search index initially — Postgres full-text search was fast enough at this scale and one less moving part

---

## What I'd Do Differently

[Be honest. What did you over-engineer? What did you under-invest in? What would week-1-you tell current-you?]

Example: "I'd set up integration tests from week 1. I lost 3 days debugging an RLS policy that unit tests couldn't catch — a single integration test would have surfaced it immediately."
`
