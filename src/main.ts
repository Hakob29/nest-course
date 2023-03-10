import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get("PORT");
  const HOST = configService.get("HOST");
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nest Course')
    .setDescription('Nest Course API description')
    .setVersion('1.0')
    .addTag('TAG')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT || 3001, () => {
    console.log('Server has been started in ' + HOST + PORT)
  });
}
bootstrap();
