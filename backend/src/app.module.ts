import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InboxLogModule } from './modules/inbox-log/inbox-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxLogUserModule } from './modules/inbox-log-user/inbox-log-user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { basicAuthMiddleware } from './middlewares/basic-auth.middleware';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: './../.env',
    }),
    ServeStaticModule.forRoot({
      exclude: ['/api*'],
      rootPath: join(__dirname, '..', '..', 'storage', 'avatars'),
      serveRoot: '/avatars/',
    }),
    InboxLogModule,
    ProjectModule,
    InboxLogUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // exclude all public routes and the login-route
    if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD) {
      consumer
        .apply(basicAuthMiddleware)
        .exclude('avatars/(.+)')
        .forRoutes('*');
    }
  }
}
