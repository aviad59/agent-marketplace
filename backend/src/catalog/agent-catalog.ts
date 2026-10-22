import { AgentEntry } from './agent-entry';

/**
 * The only way anything reads catalog entries (ADR-001).
 * Storage is decided in a later lesson (ADR-003/004): a new source extends this
 * class, passes test/catalog.contract.spec.ts, and replaces the in-code source.
 */
export abstract class AgentCatalog {
  /** Entries in display order. */
  abstract list(): Promise<AgentEntry[]>;
  /** The entry, or null when no entry has this id. */
  abstract get(id: string): Promise<AgentEntry | null>;
}
