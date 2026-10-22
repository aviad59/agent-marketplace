# Agent Marketplace — Development Plan

| | |
|---|---|
| **Status** | Draft — Milestones 1–2 detailed; later work listed, not scoped |
| **Date** | 2026-10-22 |
| **Related** | [PRD](PRD.md) · [Architecture](Architecture.md) · [Design Guidelines](Design-Guidelines.md) · [Test Plan](Test-Plan.md) |

## 1. Milestones

| Milestone | Outcome | Exit condition |
|---|---|---|
| **M1 — Demonstration** | Browse three entries, open details, return | All M1 tasks done; [Test Plan](Test-Plan.md) M1 exit criteria met |
| **M2 — Connect the Coding Agent** | Coding Agent goes from Not connected to Connected and answers one request | All M2 tasks done; M1 + M2 exit criteria met |
| **Later** | Storage, real samples, search, authoring, identity | Scoped in the lesson that introduces each |

## 2. Definition of Done (every task)

- Meets its acceptance criteria below.
- Tests for it exist and pass (see the test IDs in each task).
- Follows [Design Guidelines](Design-Guidelines.md) — labels, focus, contrast.
- No dependency on a database or data-access library (ADR-003/004 are open).
- Docs updated if behaviour or a decision changed.

## 3. Milestone 1 — Demonstration

| ID | Task | Depends on | Acceptance criteria |
|---|---|---|---|
| **T1.1** | Set up the project skeleton | — | Starts locally with one documented command; test runner runs an empty suite; README lists the command. *(Stack is ADR-006 — confirm before starting.)* |
| **T1.2** | Define `AgentEntry` and `AgentStatus` | T1.1 | Types match [Architecture](Architecture.md) §4.1. Status states are exactly: sample, not_connected, connecting, connected, error. |
| **T1.3** | Write the three entries in the in-code catalog source | T1.2 | Entries `coding-agent`, `document-summarizer`, `data-assistant` with name, summary, description. Coding Agent `kind = local`; others `kind = sample`. Sample copy follows Design §7 (future tense). |
| **T1.4** | Implement `AgentCatalog` over the in-code source | T1.3 | `list()` returns the three entries in display order; `get(id)` returns the entry or NotFound. Passes catalog contract suite (TC-C.1–C.4). |
| **T1.5** | Implement the static adapters | T1.2 | Sample adapter: status `sample`, `send` returns "not available". Coding Agent adapter (M1 version): status `not_connected`, makes no contact with the agent. Passes adapter contract suite (TC-A.1–A.3). |
| **T1.6** | Build the status badge | T1.2 | Renders label + marker + colour per Design §3 for all five states; not focusable; AA contrast. |
| **T1.7** | Build the catalog view | T1.4, T1.5, T1.6 | Three cards with name, summary, badge; whole card is a single link; responsive 1–3 columns; intro sentence present. (TC-1.1, TC-1.2) |
| **T1.8** | Build the detail view | T1.4, T1.5, T1.6 | Shows back link, name, badge, explanation, About, What you can do now. No action controls on samples; no Connect button on Coding Agent in M1. (TC-1.3, TC-1.4, TC-1.5) |
| **T1.9** | Routing and return navigation | T1.7, T1.8 | `/` and `/agents/{id}` work, including when opened directly. Back link and browser back both return to catalog with scroll and focus restored; page titles per Design §5. (TC-1.6–TC-1.9) |
| **T1.10** | Not-found handling | T1.9 | Unknown id shows "Agent not found" with link back. (TC-1.10) |
| **T1.11** | Accessibility pass | T1.7–T1.10 | Full flow by keyboard only; screen reader announces page changes and statuses; automated a11y check reports no violations. (TC-1.11, TC-1.12) |
| **T1.12** | Demo script and walkthrough | T1.11 | Written 2-minute script in README that walks catalog → each entry → back; run once by someone who hasn't seen it. (TC-1.13) |

**Order:** T1.1 → T1.2 → (T1.3, T1.5, T1.6 in parallel) → T1.4 → (T1.7, T1.8) → T1.9 → T1.10 → T1.11 → T1.12.

## 4. Milestone 2 — Connect the Coding Agent

| ID | Task | Depends on | Acceptance criteria |
|---|---|---|---|
| **T2.1** | Investigate the Coding Agent's local interface | M1 | Short written note (added to [Architecture](Architecture.md) §6) answering §6.1's questions; ADR-005 decided (A direct or B bridge) with reason. |
| **T2.2** | Local bridge *(only if ADR-005 = B)* | T2.1 | Listens on the local machine only; exposes status and send; keeps any agent credentials server-side; returns structured errors. (TC-2.10, TC-2.11) |
| **T2.3** | Live Coding Agent adapter | T2.1, (T2.2) | Implements `status`, `connect`, `send` against the real agent; passes the adapter contract suite; Sample adapter unchanged. (TC-A.1–A.3) |
| **T2.4** | Time limits and status checks | T2.3 | Connection-check and request time limits chosen and written into [Architecture](Architecture.md) §6.3; exceeding either results in `error` with a reason. (TC-2.6) |
| **T2.5** | Connect action in the detail view | T2.3 | Connect button shown when `not_connected` or `error`; shows Connecting…; result shown in place; live region announces it. (TC-2.1–TC-2.3) |
| **T2.6** | Request box and reply | T2.5 | Visible only when `connected`; labelled field with length limit; reply shown as text (monospaced for code); page stays usable while waiting. (TC-2.4, TC-2.5, TC-2.12) |
| **T2.7** | Failure handling | T2.4, T2.6 | Agent not running, stops mid-request, errors or times out → error label, one-line reason, Retry; no raw traces; browsing still works. (TC-2.6–TC-2.9) |
| **T2.8** | Card status reflects live state | T2.3 | Catalog card for Coding Agent shows the current state after a check; samples unchanged. (TC-2.13) |
| **T2.9** | Regression and demo update | T2.1–T2.8 | All M1 tests pass; demo script extended with "start the agent → connect → send one request → stop the agent → see the error". (TC-2.14) |

**Order:** T2.1 → (T2.2 if needed) → T2.3 → (T2.4, T2.5, T2.8) → T2.6 → T2.7 → T2.9.

## 5. Later work (not scoped)

Listed so nothing in M1–M2 blocks them. Each gets its own tasks when its lesson arrives.

| Item | Decided in | Expected shape |
|---|---|---|
| Choose storage for the catalog | Lesson on data | New `AgentCatalog` implementation passing the contract suite (ADR-003) |
| Choose data-access approach | Lesson on data | Lives inside the catalog source (ADR-004) |
| Real Document Summarizer | Later lesson | New adapter; entry `kind` changes to `local` (or new kind) |
| Real Data Assistant | Later lesson | Same pattern |
| Search and filter | When catalog grows | UI above grid; may extend `AgentCatalog` |
| Add / register an agent | Later lesson | New authoring flow; depends on storage |
| Identity / per-user state | Not yet agreed | New interface |

## 6. Traceability

| Requirement | Tasks |
|---|---|
| FR-1.1 | T1.3, T1.4, T1.7 |
| FR-1.2 | T1.7, T1.9 |
| FR-1.3 | T1.8 |
| FR-1.4 | T1.9 |
| FR-1.5 | T1.5, T1.6, T1.8 |
| FR-1.6 | T1.10 |
| NFR-1.1 | T1.1 |
| NFR-1.2 | T1.6, T1.11 |
| FR-2.1 | T2.3, T2.4, T2.8 |
| FR-2.2 | T2.5 |
| FR-2.3 | T2.6 |
| FR-2.4 | T2.4, T2.7 |
| FR-2.5 | T2.3 |
| FR-2.6 | T2.9 |
| NFR-2.1 | T2.1, T2.2 |
| NFR-2.2 | T2.1, T2.2 |
