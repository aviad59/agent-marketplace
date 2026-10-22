import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Agents API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(() => app.close());

  it('GET /api/agents lists the three entries with their status', async () => {
    const res = await request(app.getHttpServer()).get('/api/agents').expect(200);
    expect(res.body.map((a: any) => [a.id, a.status.state])).toEqual([
      ['coding-agent', 'not_connected'],
      ['document-summarizer', 'sample'],
      ['data-assistant', 'sample'],
    ]);
  });

  it('GET /api/agents/:id returns one entry with its status', async () => {
    const res = await request(app.getHttpServer()).get('/api/agents/coding-agent').expect(200);
    expect(res.body).toMatchObject({
      id: 'coding-agent',
      name: 'Coding Agent',
      kind: 'local',
      status: { state: 'not_connected', message: expect.any(String) },
    });
  });

  it('GET /api/agents/:id returns 404 for an unknown id', async () => {
    await request(app.getHttpServer()).get('/api/agents/unknown').expect(404);
  });
});
