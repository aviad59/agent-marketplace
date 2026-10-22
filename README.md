# Agents Marketplace

Project documentation lives in [`docs/`](docs/).

Milestone 1: browse the three catalog entries, open their details and return. No database and no agents are run.

| Part | Stack | Path |
|---|---|---|
| Backend | NestJS, listens on `127.0.0.1:3000` only | [`backend/`](backend/) |
| Frontend | React + Vite, on `127.0.0.1:5173` | [`frontend/`](frontend/) |

## Run

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Then open http://127.0.0.1:5173. The frontend forwards `/api` requests to the backend.

## Test

```sh
npm test        # backend: catalog + adapter contract suites, API tests
npm run build   # type-checks and builds both apps
```

## API

| Request | Returns |
|---|---|
| `GET /api/agents` | All entries, in display order, each with its current `status` |
| `GET /api/agents/:id` | One entry with its `status`, or 404 |

Entries come from an in-code source behind the `AgentCatalog` interface (`backend/src/catalog/`), so storage can be chosen in a later lesson without touching the API or UI. Each agent's status comes from its `AgentAdapter` (`backend/src/agents/`); in Milestone 1 the Coding Agent's adapter always reports "Not connected" and never contacts the agent.
