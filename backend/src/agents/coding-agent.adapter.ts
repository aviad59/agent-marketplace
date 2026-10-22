import { AgentAdapter, AgentError } from './agent-adapter';
import { AgentStatus, staticStatus } from './agent-status';

/**
 * Milestone 1 version: reports a fixed "Not connected" and never contacts the agent.
 * Milestone 2 replaces it with a live adapter once T2.1 settles how the agent is reached.
 */
export class CodingAgentAdapter implements AgentAdapter {
  async status(): Promise<AgentStatus> {
    return staticStatus('not_connected');
  }

  async connect(): Promise<AgentStatus> {
    return staticStatus('not_connected');
  }

  async send(_request: string): Promise<AgentError> {
    return { ok: false, reason: "Not available: the marketplace isn't connected to the Coding Agent yet." };
  }
}
