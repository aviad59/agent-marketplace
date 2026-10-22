# Agent Marketplace — Product Requirements (PRD)

| | |
|---|---|
| **Status** | Draft — agreed scope, Milestones 1–2 |
| **Date** | 2026-10-22 |
| **Related** | [Architecture](Architecture.md) · [Design Guidelines](Design-Guidelines.md) · [Dev Plan](Dev-Plan.md) · [Test Plan](Test-Plan.md) |

## 1. Summary

An agent marketplace for course participants: one place to discover the agents built and used in the course, see what each one does, and — once connected — use them. It starts as a demonstration and grows into a real product over the course, one lesson at a time.

## 2. Goals

- **G1 — Discover.** A participant can see which agents exist and what each is for.
- **G2 — Be honest about what is real.** At every stage, it is obvious which entries work, which exist but aren't connected, and which are samples.
- **G3 — Grow without rewrites.** Each lesson adds capability on top of the previous milestone instead of replacing it.

### Not goals (unless a later lesson decides otherwise)

- Payments, pricing or licensing.
- Public distribution outside the course.
- Choosing a database or data-access approach now (see §8).

## 3. Users

| User | Need | From |
|---|---|---|
| Course participant | Browse agents, understand them, later use them | M1 |
| Instructor | Demonstrate the marketplace and extend it lesson by lesson | M1 |
| Agent author (participant publishing their own agent) | Add an agent to the catalog | Later |

## 4. Glossary

| Term | Meaning |
|---|---|
| **Entry** | One agent listed in the marketplace catalog. |
| **Catalog** | The list of all entries. |
| **Sample** | An entry that shows what the marketplace will hold. Not functional. |
| **Local agent** | An agent that exists on the participant's machine. |
| **Not connected** | A local agent the marketplace cannot reach or use yet. |
| **Connected** | A local agent the marketplace can reach and send requests to. |

## 5. Initial catalog

| Entry | Milestone 1 status | Milestone 2 status |
|---|---|---|
| **Coding Agent** | Exists locally — **Not connected** | **Connected** (when running locally) |
| **Jira Task Advisor** | **Sample** | Sample |
| **Task Intermediary** | **Sample** | Sample |

Descriptions for each entry are written in the catalog content (Dev Plan T1.3). They describe purpose only and make no claim of working functionality for samples.

### 5.1 The two sample entries

The Jira Task Advisor and the Task Intermediary are listed in the catalog as **Samples**. They show the kind of agent the whole marketplace is for: agents that work with outside systems and people. Nothing here promises they will be built.

| Entry | What it will do | What it will need from the marketplace |
|---|---|---|
| **Jira Task Advisor** | Will read tasks from Jira and recommend courses of action and test cases | Read access to Jira, a way to hold the participant's Jira credentials safely, a place to show recommendations |
| **Task Intermediary** | Will sit between a department manager and development team leads: read tasks from WhatsApp, document them, and assign them to specific individuals on a designated platform | Read access to WhatsApp messages, write access to the assignment platform, a clear record of what it documented and assigned, and consent from the people involved |

Both read from an outside system, produce text or records, and (the second) change things elsewhere. That is why the marketplace needs, later: per-agent connections to outside systems, credentials kept out of the browser, permissions shown before use, and an activity record. See [Architecture](Architecture.md) §11.

## 6. Whole-marketplace capability map

| Capability | Description | Milestone |
|---|---|---|
| Browse catalog | See all entries with name, short description and status | **M1** |
| View details | Open an entry and see its full description, status and what can be done now | **M1** |
| Return to catalog | Get back to the list from any detail view, where you left off | **M1** |
| Show status honestly | Sample / Not connected / Connected / Error, with an explanation | **M1** (static), **M2** (live for Coding Agent) |
| Connect a local agent | Detect and connect to the Coding Agent running locally | **M2** |
| Use a connected agent | Send a request to the Coding Agent and see its reply | **M2** (minimal round trip) |
| Handle agent failures | Clear messages and retry when the agent isn't running or fails | **M2** |
| Persistent catalog | Entries stored outside the code | Later — storage decided in a later lesson |
| Real Jira Task Advisor / Task Intermediary | Replace samples with working agents | Later |
| Search and filter | Find entries as the catalog grows | Later |
| Add / register an agent | Authors publish their own agent to the catalog | Later |
| Identity and per-user state | Who is using the marketplace, their connections | Later — not yet agreed |
| Connect agents to outside systems | An agent can use Jira, WhatsApp or an assignment platform with the participant's own access | Later — see §5.1 |
| Show permissions before use | Detail view states what an agent reads and what it changes | Later |
| Activity record | What an agent read, documented or assigned, visible to the participant | Later |
| Agents that change things | Agents that write to outside systems (e.g. assign tasks) need confirmation and limits | Later |

"Later" items are listed so the design leaves room for them. They are not committed and will be scoped in the lesson that introduces them.

## 7. Requirements

### 7.1 Milestone 1 — Browse, open details, return

| ID | Requirement | Acceptance criteria |
|---|---|---|
| **FR-1.1** | The catalog lists the three initial entries. | Exactly three entries appear: Coding Agent, Jira Task Advisor, Task Intermediary. Each shows name, one-line description and status. |
| **FR-1.2** | Any entry can be opened. | Selecting an entry (mouse, touch or keyboard) opens its detail view. Each entry has its own address (URL) that opens the same view directly. |
| **FR-1.3** | The detail view explains the entry. | Shows name, status with a one-sentence explanation, full description, and a "what you can do now" section. |
| **FR-1.4** | The participant can return to the catalog. | A visible back control and the browser's back action both return to the catalog, at the same scroll position, with focus on the entry that was opened. |
| **FR-1.5** | Statuses are honest. | Samples are labelled "Sample". Coding Agent is labelled "Not connected". No control appears enabled unless it does something; a disabled control has a visible reason next to it. |
| **FR-1.6** | Unknown entries are handled. | Opening an address for an entry that doesn't exist shows a "not found" message with a way back to the catalog. |
| **NFR-1.1** | Runs locally. | Starts with one documented command on a participant machine. Needs no network service and no database. |
| **NFR-1.2** | Accessible. | Fully usable by keyboard; meets WCAG 2.1 AA contrast; status is never conveyed by colour alone. |

### 7.2 Milestone 2 — Connect the Coding Agent

| ID | Requirement | Acceptance criteria |
|---|---|---|
| **FR-2.1** | The marketplace knows whether the Coding Agent is reachable. | With the agent running, its status shows **Connected**; with it stopped, **Not connected**; on a failed check, **Error** with a reason. |
| **FR-2.2** | The participant can connect from the detail view. | The Coding Agent detail view offers a Connect action (or connects automatically, if T2.1 finds no explicit step is needed). The outcome is shown in place. |
| **FR-2.3** | A connected agent can be used. | The participant can send one request to the Coding Agent from its detail view and see the agent's reply. This round trip is the proof of connection. |
| **FR-2.4** | Failures don't break the marketplace. | If the agent isn't running, stops mid-request, errors or doesn't answer within the time limit, a clear message and a retry are shown, and browsing still works. |
| **FR-2.5** | Samples are unaffected. | Jira Task Advisor and Task Intermediary remain Samples and behave as in M1. |
| **FR-2.6** | Milestone 1 still holds. | All M1 requirements still pass. |
| **NFR-2.1** | Stays local. | The connection to the agent is limited to the participant's own machine and is not exposed to the network. |
| **NFR-2.2** | No secrets in the browser. | Any credential the agent needs is never sent to or stored in the browser. |

## 8. Open decisions

**Deliberately left open for later lessons** (per agreed scope):

| Decision | Constraint until decided |
|---|---|
| Database / storage for the catalog and any user data | Nothing in M1–M2 may depend on a particular database. The three entries live in an in-code catalog behind an interface. |
| Data-access approach (ORM, query layer, API shape for data) | All reads go through the catalog interface defined in [Architecture](Architecture.md) §4, so the choice can be slotted in later. |

**Not covered by the agreed scope — to confirm:**

| Decision | Note |
|---|---|
| Technology stack / framework | Docs are written stack-neutral. |
| How the marketplace talks to the Coding Agent | Determined by the agent's existing local interface — investigated in Dev Plan T2.1. |
| Identity / sign-in | Not needed for M1–M2. |
| Hosting beyond local | Not needed for M1–M2. |
| UI language (Hebrew, English, both; RTL) | See [Design Guidelines](Design-Guidelines.md) §9. |

## 9. Success measures

- **M1:** A participant who hasn't seen the marketplace goes catalog → details → back to catalog without help. No reviewer mistakes a sample for a working agent.
- **M2:** With the Coding Agent running locally, a participant connects it and gets a reply to one request. With it stopped, they see why and how to fix it.

## 10. Risks

| Risk | Mitigation |
|---|---|
| The demo is mistaken for a working product | Status labels and explanations on every card and detail view (FR-1.5). |
| The Coding Agent's local interface is unknown or awkward to reach from a browser | Investigation task first in M2 (T2.1); architecture allows a small local bridge if needed. |
| Early choices lock in storage before the lesson on it | Catalog and agent access sit behind interfaces; contract tests keep any future implementation honest. |
| Scope creep from "whole marketplace" items | "Later" items are design headroom only; each needs its own scoping. |
| Agents handling other people's messages (e.g. WhatsApp) raise privacy and consent questions | Not in M1–M2. Must be scoped before any such agent is listed as usable; permissions and activity record are prerequisites. |
| An agent that assigns work could assign it wrongly | Later: confirmation before changes, visible activity record, ability to undo or stop. |
