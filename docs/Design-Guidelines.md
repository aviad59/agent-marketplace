# Agent Marketplace — Design Guidelines

| | |
|---|---|
| **Status** | Draft — Milestones 1–2 |
| **Date** | 2026-10-22 |
| **Related** | [PRD](PRD.md) · [Architecture](Architecture.md) · [Dev Plan](Dev-Plan.md) · [Test Plan](Test-Plan.md) |

## 1. Principles

1. **Honest status.** Every entry says what it is right now. A sample never looks like it works.
2. **One obvious path.** Catalog → details → back. Nothing competes with it in M1.
3. **Nothing pretends.** A control is either working, or visibly disabled with the reason beside it.
4. **Room to grow.** Layouts work with 3 entries and with 30, so later features slot in.
5. **Accessible by default.** Keyboard, screen reader and contrast are part of "done", not a later pass.

## 2. Screens

### 2.1 Catalog

```text
┌───────────────────────────────────────────────┐
│ Agent Marketplace                             │
│ Agents from the course. Some are samples      │
│ while the marketplace is being built.         │
│                                               │
│ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│ │ Coding Agent│ │ Document    │ │ Data      │ │
│ │ one line…   │ │ Summarizer  │ │ Assistant │ │
│ │             │ │ one line…   │ │ one line… │ │
│ │ ◐ Not       │ │ ◇ Sample    │ │ ◇ Sample  │ │
│ │  connected  │ │             │ │           │ │
│ └─────────────┘ └─────────────┘ └───────────┘ │
└───────────────────────────────────────────────┘
```

- Page title and one sentence that says this is a demonstration in progress.
- Cards in a responsive grid: one column on narrow screens, up to three on wide.
- Card content, top to bottom: name, one-line summary, status badge.
- The whole card is one link to the detail view (one focus stop per card, not several).
- Order: as returned by the catalog. No sorting or filter controls in M1.

### 2.2 Detail

```text
┌───────────────────────────────────────────────┐
│ ← All agents                                  │
│                                               │
│ Coding Agent                ◐ Not connected   │
│ Exists on this machine, but the marketplace   │
│ isn't connected to it yet.                    │
│                                               │
│ About                                         │
│ Full description…                             │
│                                               │
│ What you can do now                           │
│ Read about this agent. Connecting arrives in  │
│ the next milestone.                           │
└───────────────────────────────────────────────┘
```

- Back link at the top, text "← All agents".
- Heading = entry name, with the status badge beside it and the status explanation directly under it.
- Sections: **About** (full description) and **What you can do now** (plain statement of available actions).
- M2 adds an **Actions** area for the Coding Agent: Connect, then a request box and the reply (§6).

### 2.3 Not found

- Heading "Agent not found", one sentence, and a link "← All agents".

## 3. Status vocabulary

Use exactly these labels and explanations everywhere (card, detail, messages).

| State | Label | Marker | Explanation (detail view) |
|---|---|---|---|
| `sample` | **Sample** | ◇ neutral grey | Example entry showing what the marketplace will hold. It doesn't run yet. |
| `not_connected` | **Not connected** | ◐ amber | Exists on this machine, but the marketplace isn't connected to it yet. |
| `connecting` | **Connecting…** | spinner | Checking whether the agent is reachable. |
| `connected` | **Connected** | ● green | Ready. You can send it a request below. |
| `error` | **Couldn't connect** | ✕ red | Short reason (e.g. "The agent isn't running") + **Retry**. |

Rules:

- Always show the label text and a marker shape; colour is extra, never the only signal.
- Status badges are not buttons and don't look clickable.
- In M1 the Coding Agent shows **Not connected** with the explanation above, and the "What you can do now" section says connecting comes in the next milestone. No Connect button appears in M1.

## 4. Actions and controls

- Show a control only if it does something now — or if showing it disabled teaches something. When disabled, put the reason in visible text next to it, not only in a tooltip.
- Samples have no action controls.
- Destructive or long-running actions (later) say what will happen before it happens.

## 5. Navigation and focus

- Every entry has its own address; opening it directly shows the same view.
- "← All agents" and the browser back button do the same thing.
- Returning to the catalog restores the previous scroll position and puts keyboard focus on the card that was opened.
- Opening a detail view moves focus to its heading so screen readers announce the new page.
- Page title (browser tab) changes per view: "Agent Marketplace", "Coding Agent — Agent Marketplace".

## 6. Milestone 2 additions (Coding Agent)

- **Connect:** a primary button in the Actions area while state is `not_connected` or `error`. While connecting, the button shows "Connecting…" and is disabled.
- **Request box:** appears only when `connected`. A multi-line text field with a label, a Send button and a character limit shown as you type.
- **Reply:** shown as plain text under the request, in a monospaced block when it contains code. Long replies scroll within the block.
- **Waiting:** while a request runs, show "Waiting for the Coding Agent…" and keep the rest of the page usable.
- **Failure:** replace the waiting message with the error label from §3, a one-line reason and **Retry**. Never show raw stack traces.
- Status updates are announced to screen readers (polite live region).

## 7. Copy

- Names exactly as defined: **Coding Agent**, **Jira Task Advisor**, **Task Intermediary**.
- Say "agent", not "bot" or "AI".
- Short, plain sentences. Second person ("You can…"). No exclamation marks.
- Never describe a sample's capabilities as if they work today: "will summarise documents", not "summarises documents".

## 8. Visual basics

- Spacing on a 4-px scale (4, 8, 12, 16, 24, 32).
- Type: one family; sizes for page title, entry heading, body and small text only.
- Cards: same height within a row, rounded corners, visible focus ring (≥ 2 px, AA contrast against background).
- Contrast: text and badges meet WCAG 2.1 AA in both light and dark themes, if dark is supported.
- Motion: none needed in M1; respect "reduce motion" for any later transitions.
- Layout works from 360 px wide with no horizontal scrolling.

## 9. Language and direction (open)

The UI language isn't agreed. If Hebrew is used (alone or with English):

- Set document direction to RTL for Hebrew.
- Use direction-neutral layout rules (start/end, not left/right) so one layout serves both.
- Mirror directional icons such as the back arrow.
- Keep agent names and code in replies left-to-right inside RTL text.

## 10. Later screens (headroom, not designed yet)

- Search and filter above the grid once the catalog grows.
- Add / register an agent form for authors.
- Real actions for Jira Task Advisor and Task Intermediary, following §6's pattern.
- Empty catalog state ("No agents yet") once entries come from storage.

### Agents that use outside systems (e.g. Jira advisor, WhatsApp task intermediary)

Not designed in detail. When they arrive, the detail view follows these rules, building on §3, §4 and §6:

- A **Permissions** section states in plain words what the agent reads ("Reads tasks from Jira") and what it changes ("Assigns tasks on the team platform"), before any Connect action.
- Connecting an outside system is a separate, visible step per system, showing connected / not connected for each.
- Anything that changes something elsewhere says what will happen and asks for confirmation first (§4).
- Results appear as a readable list (recommendations, test cases, documented tasks, assignments), each with where it came from.
- An **Activity** section shows what the agent did, with a way to stop it.
- Agents handling other people's messages say so plainly on the card and the detail view.
- Descriptions follow §7: an agent that isn't built yet "will read tasks from Jira", never "reads".
