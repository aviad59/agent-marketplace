/** One agent listed in the marketplace catalog (Architecture §4.1). */
export interface AgentEntry {
  /** Stable, URL-safe id, e.g. "coding-agent". */
  id: string;
  name: string;
  /** One line, shown on the card. */
  summary: string;
  /** Full text, shown on the detail view. */
  description: string;
  kind: 'sample' | 'local';
  /** What it is for, in plain words. */
  capabilities: string[];
  /** Plain statement of what a participant can do with it today. */
  canDoNow: string;
}
