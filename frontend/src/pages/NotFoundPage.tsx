import { useEffect, useRef } from 'react';
import { BackLink } from '../components/BackLink';

export function NotFoundPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = 'Agent not found — Agent Marketplace';
    headingRef.current?.focus();
  }, []);

  return (
    <article className="detail">
      <BackLink />
      <h1 ref={headingRef} tabIndex={-1}>
        Agent not found
      </h1>
      <p className="status-explain">
        There's no agent at this address. It may have been removed or the link may be wrong.
      </p>
    </article>
  );
}
