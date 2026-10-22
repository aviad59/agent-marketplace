import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { type Agent, getAgent, NotFoundError } from '../api';
import { BackLink } from '../components/BackLink';
import { LoadError } from '../components/LoadError';
import { StatusBadge } from '../components/StatusBadge';
import { NotFoundPage } from './NotFoundPage';

type Load = { kind: 'loading' } | { kind: 'ready'; agent: Agent } | { kind: 'notFound' } | { kind: 'failed' };

export function DetailPage() {
  const { id = '' } = useParams();
  const [load, setLoad] = useState<Load>({ kind: 'loading' });
  const headingRef = useRef<HTMLHeadingElement>(null);

  const fetchAgent = useCallback(() => {
    setLoad({ kind: 'loading' });
    getAgent(id)
      .then((agent) => setLoad({ kind: 'ready', agent }))
      .catch((err) => setLoad(err instanceof NotFoundError ? { kind: 'notFound' } : { kind: 'failed' }));
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAgent();
  }, [fetchAgent]);

  // Announce the new page to screen readers by moving focus to its heading (Design §5).
  useEffect(() => {
    if (load.kind !== 'ready') return;
    document.title = `${load.agent.name} — Agent Marketplace`;
    headingRef.current?.focus();
  }, [load]);

  if (load.kind === 'notFound') return <NotFoundPage />;

  return (
    <article className="detail">
      <BackLink />
      {load.kind === 'loading' && <p className="loading">Loading…</p>}
      {load.kind === 'failed' && <LoadError onRetry={fetchAgent} />}
      {load.kind === 'ready' && (
        <>
          <div className="detail-head">
            <h1 ref={headingRef} tabIndex={-1}>
              {load.agent.name}
            </h1>
            <StatusBadge state={load.agent.status.state} />
          </div>
          <p className="status-explain">{load.agent.status.message}</p>

          <section aria-labelledby="about">
            <h2 id="about">About</h2>
            <p>{load.agent.description}</p>
            <ul>
              {load.agent.capabilities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="now">
            <h2 id="now">What you can do now</h2>
            <p>{load.agent.canDoNow}</p>
          </section>
        </>
      )}
    </article>
  );
}
