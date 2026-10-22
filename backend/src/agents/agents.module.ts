import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';
import { AgentAdapters } from './agent-adapters';
import { AgentsController } from './agents.controller';

@Module({
  imports: [CatalogModule],
  controllers: [AgentsController],
  providers: [AgentAdapters],
})
export class AgentsModule {}
