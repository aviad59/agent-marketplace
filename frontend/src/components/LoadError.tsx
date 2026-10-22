export function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="load-error" role="alert">
      <p>Couldn't reach the marketplace backend. Check that it is running, then try again.</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
