import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // important to define cors before basic-auth
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,OPTIONS,PUT,DELETE',
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.BACKEND_PORT || 4000);
}
bootstrap();
