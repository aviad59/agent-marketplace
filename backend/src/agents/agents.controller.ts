import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { AgentCatalog } from '../catalog/agent-catalog';
import { AgentEntry } from '../catalog/agent-entry';
import { AgentAdapters } from './agent-adapters';
import { AgentStatus } from './agent-status';

export type AgentView = AgentEntry & { status: AgentStatus };

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly catalog: AgentCatalog,
    private readonly adapters: AgentAdapters,
  ) {}

  @Get()
  async list(): Promise<AgentView[]> {
    const entries = await this.catalog.list();
    return Promise.all(entries.map((e) => this.withStatus(e)));
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<AgentView> {
    const entry = await this.catalog.get(id);
    if (!entry) throw new NotFoundException('Agent not found');
    return this.withStatus(entry);
  }

  private async withStatus(entry: AgentEntry): Promise<AgentView> {
    return { ...entry, status: await this.adapters.for(entry).status() };
  }
}
