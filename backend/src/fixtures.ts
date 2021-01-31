import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FixturesService } from './fixtures/fixtures.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const fixturesService = app.get(FixturesService);

  await fixturesService.makeFixtures();
  await app.close();
}
bootstrap();
