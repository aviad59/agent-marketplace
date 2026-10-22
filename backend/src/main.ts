import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const HOST = '127.0.0.1'; // local machine only (NFR-2.1)
const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(PORT, HOST);
  console.log(`Backend listening on http://${HOST}:${PORT}/api`);
}
bootstrap();
