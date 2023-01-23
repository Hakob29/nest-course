import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get("PORT");
  const HOST = config.get("HOST");
  await app.listen(PORT, () => {
    console.log('Server has been started in ' + HOST + PORT)
  });
}
bootstrap();
