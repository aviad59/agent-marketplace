export type AgentState = 'sample' | 'not_connected' | 'connecting' | 'connected' | 'error';

/** Computed by an adapter; can change at run time (Architecture §4.1). */
export interface AgentStatus {
  state: AgentState;
  /** One-sentence explanation shown to the user. */
  message: string;
  /** When the status was last determined (ISO 8601); null for static statuses. */
  checkedAt: string | null;
}

/** Explanations from Design Guidelines §3. */
export const STATUS_MESSAGES: Record<AgentState, string> = {
  sample: "Example entry showing what the marketplace will hold. It doesn't run yet.",
  not_connected: "Exists on this machine, but the marketplace isn't connected to it yet.",
  connecting: 'Checking whether the agent is reachable.',
  connected: 'Ready. You can send it a request below.',
  error: "The agent couldn't be reached.",
};

export function staticStatus(state: AgentState): AgentStatus {
  return { state, message: STATUS_MESSAGES[state], checkedAt: null };
}
