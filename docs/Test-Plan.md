# Agent Marketplace — Test Plan

| | |
|---|---|
| **Status** | Draft — Milestones 1–2 |
| **Date** | 2026-10-22 |
| **Related** | [PRD](PRD.md) · [Architecture](Architecture.md) · [Design Guidelines](Design-Guidelines.md) · [Dev Plan](Dev-Plan.md) |

## 1. Approach

| Level | What it covers | Run |
|---|---|---|
| **Contract** | Any `AgentCatalog` or `AgentAdapter` implementation behaves the same | Every change; required for any future storage or agent |
| **Unit** | Domain types, status mapping, small UI pieces (badge) | Every change |
| **End-to-end** | Real flows in a browser: browse, open, return, connect, send | Every change to UI or routing |
| **Accessibility** | Keyboard-only run, screen reader spot check, automated checker, contrast | Each milestone exit; automated checker on every change |
| **Exploratory / demo** | A first-time participant follows the demo script | Each milestone exit |

The contract suites are what keeps the open storage and data-access decisions (ADR-003/004) safe: whatever is chosen later must pass the same suite the in-code catalog passes today.

## 2. Environments

- **M1:** participant machine, browser, no network required.
- **M2:** as M1, plus the Coding Agent in three conditions: **running**, **stopped**, and **degraded** (made slow or made to return an error — a test double of the agent is acceptable for this one).

Browsers: the latest version of at least two major browsers, plus one narrow (≈ 360 px) viewport.

## 3. Contract tests

### 3.1 Catalog (`AgentCatalog`)

| ID | Check | Expected |
|---|---|---|
| TC-C.1 | `list()` | Returns entries, each with id, name, summary, description, kind |
| TC-C.2 | Entry ids | Unique and URL-safe |
| TC-C.3 | `get(id)` for every listed id | Returns the same entry as `list()` |
| TC-C.4 | `get("does-not-exist")` | NotFound (not an error/crash) |

For the in-code source, also check: exactly the three entries, in the order Coding Agent, Jira Task Advisor, Task Intermediary.

### 3.2 Adapter (`AgentAdapter`)

| ID | Check | Expected |
|---|---|---|
| TC-A.1 | `status()` | Returns one of the five states with a non-empty message |
| TC-A.2 | Sample adapter | `status()` = sample; `connect()` = sample; `send()` = "not available"; never contacts anything |
| TC-A.3 | `connect()` / `send()` failure | Returned as `error` state / AgentError with a reason — never an unhandled exception reaching the UI |

## 4. Milestone 1 test cases

| ID | Scenario | Steps | Expected | Covers |
|---|---|---|---|---|
| TC-1.1 | Catalog content | Open `/` | Three cards: Coding Agent, Jira Task Advisor, Task Intermediary; each shows name, one-line summary and status badge | FR-1.1 |
| TC-1.2 | Card behaviour and layout | Tab through cards; resize 360 px → wide | One focus stop per card; whole card opens detail; 1 → 3 columns, no horizontal scroll | FR-1.2 |
| TC-1.3 | Coding Agent detail | Open Coding Agent | Back link, name, "Not connected" badge + explanation, About, What you can do now | FR-1.3, FR-1.5 |
| TC-1.4 | Sample details | Open each sample | "Sample" badge + explanation; future-tense description; no action controls | FR-1.3, FR-1.5 |
| TC-1.5 | Nothing pretends | Inspect every view | No enabled control that does nothing; no Connect button in M1 | FR-1.5 |
| TC-1.6 | Direct address | Paste `/agents/task-intermediary` into a fresh tab | Detail view opens directly | FR-1.2 |
| TC-1.7 | Back link | Scroll catalog, open an entry, select "← All agents" | Catalog at same scroll position; focus on the card just opened | FR-1.4 |
| TC-1.8 | Browser back | Same as TC-1.7 using browser back | Same result as TC-1.7 | FR-1.4 |
| TC-1.9 | Page titles | Visit catalog and each detail | Tab title per Design §5 | FR-1.4 |
| TC-1.10 | Unknown entry | Open `/agents/unknown` | "Agent not found" + link back; link returns to catalog | FR-1.6 |
| TC-1.11 | Keyboard only | Complete catalog → detail → back for all three, no mouse | All reachable and operable; visible focus ring throughout | NFR-1.2 |
| TC-1.12 | Accessibility checks | Automated checker on all views; contrast check; greyscale screenshot | No violations; AA contrast; statuses distinguishable in greyscale (label + marker) | NFR-1.2 |
| TC-1.13 | First-time walkthrough | Someone new follows the demo script | Completes catalog → details → back unaided; correctly says which entries are samples | PRD §9 |
| TC-1.14 | Local, offline start | Disconnect network; run the documented start command | Marketplace starts and TC-1.1–1.10 pass; no database running | NFR-1.1 |

### M1 exit criteria

- TC-C.1–C.4, TC-A.1–A.3 and TC-1.1–TC-1.14 pass.
- No open defects that break the browse → details → return flow or misrepresent a status.

## 5. Milestone 2 test cases

| ID | Scenario | Steps | Expected | Covers |
|---|---|---|---|---|
| TC-2.1 | Connect, agent running | Start agent; open Coding Agent; select Connect | Connecting… then Connected; announced to screen reader | FR-2.1, FR-2.2 |
| TC-2.2 | Connect, agent stopped | Stop agent; select Connect | "Couldn't connect" with reason that the agent isn't running; Retry shown | FR-2.1, FR-2.4 |
| TC-2.3 | Recover | After TC-2.2, start agent; select Retry | Connected | FR-2.1 |
| TC-2.4 | One round trip | Connected; type a request; Send | Waiting message, then the agent's reply shown | FR-2.3 |
| TC-2.5 | Request box rules | View while not connected; then connected; type past the limit | Hidden unless connected; labelled; limit shown and enforced | FR-2.3 |
| TC-2.6 | Time limit | Degraded agent slower than the limit set in T2.4 | Error with timeout reason + Retry | FR-2.4 |
| TC-2.7 | Agent stops mid-request | Send; stop agent before reply | Error with reason; no hang | FR-2.4 |
| TC-2.8 | Agent returns an error | Degraded agent answers with an error | Error label + one-line reason; no raw trace shown | FR-2.4 |
| TC-2.9 | Rest of app unaffected | During and after TC-2.6–2.8, browse catalog and samples | Browsing works normally | FR-2.4 |
| TC-2.10 | Local only | From a second machine on the network, try to reach the agent endpoint or bridge | Not reachable | NFR-2.1 |
| TC-2.11 | No secrets in browser | Inspect browser network traffic, storage and page source during TC-2.1–2.4 | No agent credentials present | NFR-2.2 |
| TC-2.12 | Reply shown safely | Ask for a reply containing HTML/script-like text | Displayed as text, nothing executed; code in monospaced block | FR-2.3 |
| TC-2.13 | Card reflects live state | Connect, return to catalog; stop agent, recheck, return | Card badge matches the latest known state | FR-2.1 |
| TC-2.14 | Regression | Run full M1 suite with agent running and stopped; open samples | All M1 cases pass; samples unchanged | FR-2.5, FR-2.6 |

### M2 exit criteria

- All M1 exit criteria still met.
- Adapter contract suite passes for the live Coding Agent adapter.
- TC-2.1–TC-2.14 pass.
- The time limits from T2.4 and ADR-005 are recorded in [Architecture](Architecture.md).

## 6. Traceability

| Requirement | Test cases |
|---|---|
| FR-1.1 | TC-1.1, TC-C.1 |
| FR-1.2 | TC-1.2, TC-1.6 |
| FR-1.3 | TC-1.3, TC-1.4 |
| FR-1.4 | TC-1.7, TC-1.8, TC-1.9 |
| FR-1.5 | TC-1.3, TC-1.4, TC-1.5, TC-A.2 |
| FR-1.6 | TC-1.10, TC-C.4 |
| NFR-1.1 | TC-1.14 |
| NFR-1.2 | TC-1.11, TC-1.12 |
| FR-2.1 | TC-2.1, TC-2.2, TC-2.3, TC-2.13 |
| FR-2.2 | TC-2.1 |
| FR-2.3 | TC-2.4, TC-2.5, TC-2.12 |
| FR-2.4 | TC-2.2, TC-2.6, TC-2.7, TC-2.8, TC-2.9, TC-A.3 |
| FR-2.5 | TC-2.14, TC-A.2 |
| FR-2.6 | TC-2.14 |
| NFR-2.1 | TC-2.10 |
| NFR-2.2 | TC-2.11 |

## 7. Later test areas (not scheduled)

Listed so the whole marketplace has a test direction. Cases are written when the lesson that introduces each item arrives.

| Area | What will need checking |
|---|---|
| Outside-system connections (Jira, WhatsApp, assignment platform) | Connect, disconnect, expired or wrong credentials, outside system down; credentials never in browser traffic or storage |
| Permissions | Detail view states what the agent reads and changes, and matches what it actually does |
| Agents that change things | Nothing is changed without confirmation; cancel changes nothing; failures leave no half-done state |
| Jira task advisor | Recommendations and test cases correspond to the tasks read; empty or malformed tasks handled |
| Task intermediary | Messages are documented faithfully; each task is assigned to the intended person; ambiguous or unassignable tasks are flagged, not guessed; a wrong assignment can be seen and corrected |
| Privacy | Only the permitted conversations are read; participants can see and stop what is being read |
| Activity record | Every read, documentation and assignment appears, with time and source |
| Contract suites | Every new catalog source and adapter passes the same suites as today |

## 8. Defects

Record each defect with: test case ID, steps, expected vs actual, browser, and — for M2 — agent condition (running / stopped / degraded). Anything that misrepresents an entry's status is treated as blocking.
