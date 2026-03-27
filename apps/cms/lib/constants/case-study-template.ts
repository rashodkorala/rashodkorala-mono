export const CASE_STUDY_MDX_TEMPLATE = `## Overview

[Write 2–3 sentences. What is this work? Who was involved? What was the scale or stakes?]

Example: "I led the redesign of the checkout flow for a Series A B2B SaaS serving 200+ enterprise clients. Working in a team of 4, we had 3 months to reduce cart abandonment on annual subscription upgrades."

---

## Context & Background

[What was the state of things before you started? What triggered this work? What constraints existed — time, team, legacy code, org politics?]

Example: "The existing checkout had a 68% drop-off at the plan upgrade step. The codebase was 4 years old with no tests, and the design team had just been cut from 6 to 2 people."

---

## The Problem

[Be specific. What exactly was broken, missing, or painful? Who felt it and how often?]

Example: "Enterprise buyers were abandoning at the payment step because they couldn't get purchase orders approved in the same session — the flow required immediate card payment with no PO path."

### Goals

- [Goal 1 — measurable if possible] e.g., Reduce upgrade step drop-off below 20%
- [Goal 2] e.g., Support PO-based payment for enterprise accounts
- [Goal 3] e.g., Ship within Q1 without breaking existing billing integrations

---

## Approach

[How did you break the problem down? What did you try first? What changed along the way? Show your thinking, not just what you did.]

### What I Did

1. [Phase 1] e.g., Ran 6 user interviews with ops managers who abandoned checkout
2. [Phase 2] e.g., Mapped the existing flow and identified 11 friction points
3. [Phase 3] e.g., Prototyped 3 alternative flows and tested with 2 power users before committing

### Key Decisions

[What were the meaningful choices you made? What did you explicitly NOT do, and why?]

Example: "We chose to add a 'Request PO Invoice' escape hatch rather than building a full invoicing system — faster to ship and covered 80% of the use case within the quarter."

---

## Challenges & Tradeoffs

[What was genuinely hard? Not just technical — process, people, scope, competing priorities.]

- [Challenge 1] e.g., Engineering estimated 6 weeks for a PO flow; we negotiated down to a static PDF email path deliverable in 2
- [Challenge 2] e.g., Stakeholders wanted a full redesign; we scoped it down to the 3 highest-drop steps to stay in sprint

---

## Results

[What actually happened after you shipped? Be honest — include what didn't move the needle too.]

Example: "Drop-off on the upgrade step fell from 68% to 22% within 30 days. The PO invoice path handled 34% of enterprise upgrades in month 1. Mobile conversion didn't improve — we hadn't addressed the pricing table on small screens."

---

## What I Learned

[What would you do differently? What surprised you? What did this work sharpen in you?]

Example: "I underestimated how much payment UX is shaped by the buyer's internal procurement process. Next time I'd involve a finance rep from the buyer's side in discovery interviews much earlier."
`
