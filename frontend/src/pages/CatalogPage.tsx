import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { type Agent, listAgents } from '../api';
import { LoadError } from '../components/LoadError';
import { StatusBadge } from '../components/StatusBadge';
import { type FromCatalogState, returnPosition } from '../returnPosition';

// Kept between visits so returning to the catalog renders it at once and can restore scroll.
let cachedAgents: Agent[] | null = null;

export function CatalogPage() {
  const [agents, setAgents] = useState<Agent[] | null>(cachedAgents);
  const [failed, setFailed] = useState(false);
  const cardRefs = useRef(new Map<string, HTMLAnchorElement>());
  const restored = useRef(false);

  const load = useCallback(() => {
    setFailed(false);
    listAgents()
      .then((list) => {
        cachedAgents = list;
        setAgents(list);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    document.title = 'Agent Marketplace';
    load();
  }, [load]);

  // Coming back from a detail view: same scroll position, focus on the card that was opened.
  // Runs once per visit, so a background refresh of the list doesn't move the page.
  useLayoutEffect(() => {
    if (!agents || restored.current) return;
    restored.current = true;
    const { openedId, scrollY } = returnPosition;
    window.scrollTo(0, openedId ? scrollY : 0);
    if (openedId) cardRefs.current.get(openedId)?.focus({ preventScroll: true });
  }, [agents]);

  const state: FromCatalogState = { fromCatalog: true };

  return (
    <>
      <h1>Agent Marketplace</h1>
      <p className="intro">Agents from the course. Some are samples while the marketplace is being built.</p>

      {failed && !agents && <LoadError onRetry={load} />}
      {!failed && !agents && <p className="loading">Loading agents…</p>}

      {agents && (
        <ul className="grid">
          {agents.map((agent) => (
            <li key={agent.id}>
              <Link
                to={`/agents/${agent.id}`}
                state={state}
                className="card"
                ref={(el) => {
                  if (el) cardRefs.current.set(agent.id, el);
                  else cardRefs.current.delete(agent.id);
                }}
                onClick={() => {
                  returnPosition.scrollY = window.scrollY;
                  returnPosition.openedId = agent.id;
                }}
              >
                <span className="card-name">{agent.name}</span>
                <span className="card-summary">{agent.summary}</span>
                <StatusBadge state={agent.status.state} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
