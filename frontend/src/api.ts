export type AgentState = 'sample' | 'not_connected' | 'connecting' | 'connected' | 'error';

export interface AgentStatus {
  state: AgentState;
  message: string;
  checkedAt: string | null;
}

/** An entry as the backend returns it: the catalog entry plus its current status. */
export interface Agent {
  id: string;
  name: string;
  summary: string;
  description: string;
  kind: 'sample' | 'local';
  capabilities: string[];
  canDoNow: string;
  status: AgentStatus;
}

export class NotFoundError extends Error {}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: 'application/json' } });
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export const listAgents = () => getJson<Agent[]>('/api/agents');
export const getAgent = (id: string) => getJson<Agent>(`/api/agents/${encodeURIComponent(id)}`);
