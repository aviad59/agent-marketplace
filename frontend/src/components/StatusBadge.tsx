import type { AgentState } from '../api';

/** Label and marker per Design §3. The marker shape and label carry meaning; colour is extra. */
const BADGES: Record<AgentState, { label: string; marker: string }> = {
  sample: { label: 'Sample', marker: '◇' },
  not_connected: { label: 'Not connected', marker: '◐' },
  connecting: { label: 'Connecting…', marker: '◌' },
  connected: { label: 'Connected', marker: '●' },
  error: { label: "Couldn't connect", marker: '✕' },
};

export function StatusBadge({ state }: { state: AgentState }) {
  const { label, marker } = BADGES[state];
  return (
    <span className={`badge badge-${state}`}>
      <span aria-hidden="true">{marker}</span>
      <span>{label}</span>
    </span>
  );
}
