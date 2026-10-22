import { Injectable } from '@nestjs/common';
import { AgentEntry } from '../catalog/agent-entry';
import { AgentAdapter } from './agent-adapter';
import { CodingAgentAdapter } from './coding-agent.adapter';
import { SampleAdapter } from './sample.adapter';

/** Picks the adapter for an entry. */
@Injectable()
export class AgentAdapters {
  private readonly sample = new SampleAdapter();
  private readonly codingAgent = new CodingAgentAdapter();

  for(entry: AgentEntry): AgentAdapter {
    return entry.id === 'coding-agent' ? this.codingAgent : this.sample;
  }
}
