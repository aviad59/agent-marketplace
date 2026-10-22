import { AgentAdapter, AgentError } from './agent-adapter';
import { AgentStatus, staticStatus } from './agent-status';

/** Samples have no execution path at all (Architecture §8). */
export class SampleAdapter implements AgentAdapter {
  async status(): Promise<AgentStatus> {
    return staticStatus('sample');
  }

  async connect(): Promise<AgentStatus> {
    return staticStatus('sample');
  }

  async send(_request: string): Promise<AgentError> {
    return { ok: false, reason: "Not available: sample entries don't run." };
  }
}
