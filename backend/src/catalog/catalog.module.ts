import { Module } from '@nestjs/common';
import { AgentCatalog } from './agent-catalog';
import { InCodeCatalogSource } from './in-code-catalog.source';

@Module({
  providers: [{ provide: AgentCatalog, useClass: InCodeCatalogSource }],
  exports: [AgentCatalog],
})
export class CatalogModule {}
