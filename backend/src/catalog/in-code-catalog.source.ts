import { Injectable } from '@nestjs/common';
import { AgentCatalog } from './agent-catalog';
import { AgentEntry } from './agent-entry';

const ENTRIES: readonly AgentEntry[] = [
  {
    id: 'coding-agent',
    name: 'Coding Agent',
    summary: 'Built locally in the course. Helps you read, write and change code in your projects.',
    description:
      'The Coding Agent was built during the course and runs on your own machine. ' +
      'It works on the code in your projects: explaining what a file does, suggesting changes ' +
      'and writing new code from a plain-language request. The marketplace lists it today; ' +
      'connecting the marketplace to it is the next milestone.',
    kind: 'local',
    capabilities: ['Explain code', 'Suggest and make changes', 'Write new code from a request'],
    canDoNow: 'Read about this agent. Connecting it to the marketplace arrives in the next milestone.',
  },
  {
    id: 'document-summarizer',
    name: 'Document Summarizer',
    summary: 'Sample entry. Will turn long documents into short summaries.',
    description:
      'This is a sample entry. When it is built, the Document Summarizer will take a ' +
      'long document and produce a short summary of its main points, so you can decide ' +
      'quickly whether to read the whole thing.',
    kind: 'sample',
    capabilities: ['Will summarise long documents', 'Will list the main points'],
    canDoNow: "Read about what this agent will do. It can't be used yet.",
  },
  {
    id: 'data-assistant',
    name: 'Data Assistant',
    summary: 'Sample entry. Will answer questions about your data.',
    description:
      'This is a sample entry. When it is built, the Data Assistant will answer ' +
      'plain-language questions about a data set, such as totals, trends and comparisons, ' +
      'without you writing queries yourself.',
    kind: 'sample',
    capabilities: ['Will answer questions about a data set', 'Will describe totals, trends and comparisons'],
    canDoNow: "Read about what this agent will do. It can't be used yet.",
  },
];

const copy = (e: AgentEntry): AgentEntry => ({ ...e, capabilities: [...e.capabilities] });

/** Milestone 1 catalog source: the three entries, held in code. */
@Injectable()
export class InCodeCatalogSource extends AgentCatalog {
  async list(): Promise<AgentEntry[]> {
    return ENTRIES.map(copy);
  }

  async get(id: string): Promise<AgentEntry | null> {
    const entry = ENTRIES.find((e) => e.id === id);
    return entry ? copy(entry) : null;
  }
}
