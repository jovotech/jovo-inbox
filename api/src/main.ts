import { NestFactory } from '@nestjs/core';
require('dotenv').config();
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // important to define cors before basic-auth
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,OPTIONS,PUT,DELETE',
  });
  app.setGlobalPrefix('api');
  await app.listen(4000);
}
bootstrap();
