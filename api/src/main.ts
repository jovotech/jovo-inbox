import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // important to define cors before basic-auth
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,OPTIONS,PUT,DELETE',
  });
  await app.listen(4000);
}
bootstrap();
