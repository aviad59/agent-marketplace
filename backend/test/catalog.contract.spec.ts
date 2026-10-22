import { AgentCatalog } from '../src/catalog/agent-catalog';
import { InCodeCatalogSource } from '../src/catalog/in-code-catalog.source';

/**
 * Catalog contract (Test Plan §3.1). Any future catalog source must pass this suite:
 * add it to `sources` below.
 */
const sources: [string, () => AgentCatalog][] = [['InCodeCatalogSource', () => new InCodeCatalogSource()]];

describe.each(sources)('AgentCatalog contract: %s', (_name, make) => {
  let catalog: AgentCatalog;
  beforeEach(() => (catalog = make()));

  it('TC-C.1 list() returns entries with id, name, summary, description, kind', async () => {
    const entries = await catalog.list();
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) {
      for (const field of ['id', 'name', 'summary', 'description'] as const) {
        expect(typeof e[field]).toBe('string');
        expect(e[field].length).toBeGreaterThan(0);
      }
      expect(['sample', 'local']).toContain(e.kind);
    }
  });

  it('TC-C.2 ids are unique and URL-safe', async () => {
    const ids = (await catalog.list()).map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('TC-C.3 get(id) returns the same entry as list() for every id', async () => {
    for (const e of await catalog.list()) expect(await catalog.get(e.id)).toEqual(e);
  });

  it('TC-C.4 get() of an unknown id returns not found, without throwing', async () => {
    await expect(catalog.get('does-not-exist')).resolves.toBeNull();
  });
});

describe('InCodeCatalogSource content', () => {
  it('holds exactly the three initial entries, in display order', async () => {
    const entries = await new InCodeCatalogSource().list();
    expect(entries.map((e) => [e.id, e.name, e.kind])).toEqual([
      ['coding-agent', 'Coding Agent', 'local'],
      ['document-summarizer', 'Document Summarizer', 'sample'],
      ['data-assistant', 'Data Assistant', 'sample'],
    ]);
  });

  it('describes samples in the future tense only (Design §7)', async () => {
    const samples = (await new InCodeCatalogSource().list()).filter((e) => e.kind === 'sample');
    for (const s of samples) {
      expect(s.summary).toMatch(/^Sample entry\. Will /);
      for (const c of s.capabilities) expect(c).toMatch(/^Will /);
    }
  });

  it('callers cannot change the stored entries', async () => {
    const source = new InCodeCatalogSource();
    (await source.list())[0].capabilities.push('changed');
    expect((await source.get('coding-agent'))!.capabilities).not.toContain('changed');
  });
});
