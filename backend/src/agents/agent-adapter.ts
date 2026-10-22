import { AgentStatus } from './agent-status';

export interface AgentReply {
  ok: true;
  text: string;
}

export interface AgentError {
  ok: false;
  reason: string;
}

/** How the marketplace reaches one agent (ADR-002, Architecture §4.3). */
export interface AgentAdapter {
  status(): Promise<AgentStatus>;
  connect(): Promise<AgentStatus>;
  send(request: string): Promise<AgentReply | AgentError>;
}
