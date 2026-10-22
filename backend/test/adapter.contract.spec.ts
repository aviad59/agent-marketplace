import { AgentAdapter } from '../src/agents/agent-adapter';
import { AgentAdapters } from '../src/agents/agent-adapters';
import { CodingAgentAdapter } from '../src/agents/coding-agent.adapter';
import { SampleAdapter } from '../src/agents/sample.adapter';
import { InCodeCatalogSource } from '../src/catalog/in-code-catalog.source';

const STATES = ['sample', 'not_connected', 'connecting', 'connected', 'error'];

/** Adapter contract (Test Plan §3.2). Any future adapter must pass this suite. */
const adapters: [string, () => AgentAdapter][] = [
  ['SampleAdapter', () => new SampleAdapter()],
  ['CodingAgentAdapter (M1)', () => new CodingAgentAdapter()],
];

describe.each(adapters)('AgentAdapter contract: %s', (_name, make) => {
  it('TC-A.1 status() is one of the five states with a non-empty message', async () => {
    const s = await make().status();
    expect(STATES).toContain(s.state);
    expect(s.message.length).toBeGreaterThan(0);
  });

  it('TC-A.3 connect() and send() report failure as values, never by throwing', async () => {
    const a = make();
    await expect(a.connect()).resolves.toHaveProperty('state');
    const reply = await a.send('hello');
    if (!reply.ok) expect(reply.reason.length).toBeGreaterThan(0);
  });
});

describe('TC-A.2 SampleAdapter', () => {
  it('is always a sample and never available', async () => {
    const a = new SampleAdapter();
    expect((await a.status()).state).toBe('sample');
    expect((await a.connect()).state).toBe('sample');
    expect(await a.send('hello')).toEqual({ ok: false, reason: expect.stringMatching(/^Not available/) });
  });
});

describe('CodingAgentAdapter (M1)', () => {
  it('reports Not connected and does nothing on connect', async () => {
    const a = new CodingAgentAdapter();
    expect((await a.status()).state).toBe('not_connected');
    expect((await a.connect()).state).toBe('not_connected');
    expect((await a.send('hello')).ok).toBe(false);
  });
});

describe('AgentAdapters', () => {
  it('gives the Coding Agent its own adapter and every sample the sample adapter', async () => {
    const pick = new AgentAdapters();
    for (const e of await new InCodeCatalogSource().list()) {
      const expected = e.id === 'coding-agent' ? CodingAgentAdapter : SampleAdapter;
      expect(pick.for(e)).toBeInstanceOf(expected);
    }
  });
});
