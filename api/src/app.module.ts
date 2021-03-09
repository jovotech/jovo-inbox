import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InboxLogModule } from './modules/inbox-log/inbox-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxLogEntity } from './entity/inbox-log.entity';

import config from './inbox.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { JovoAppModule } from './modules/jovo-app/jovo-app.module';
import { InboxLogUserEntity } from './entity/inbox-log-user.entity';
import { InboxLogUserModule } from './modules/inbox-log-user/inbox-log-user.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { basicAuthMiddleware } from './middlewares/basic-auth.middleware';

// TODO:
const dbImports = () => {
  if (config.apps.length === 0) {
    console.error('No app available');
    return;
  }
  const imports = [
    TypeOrmModule.forRoot({
      entities: [InboxLogEntity, InboxLogUserEntity],
      synchronize: true,
      ...{
        timezone: '+0',
      },
      ...(config.apps[0].connection as Partial<TypeOrmModuleOptions>),
    }),
  ];
  config.apps.forEach((app: any) => {
    imports.push(
      TypeOrmModule.forRoot({
        name: app.id,
        entities: [InboxLogEntity, InboxLogUserEntity],
        synchronize: true,
        ...{
          timezone: '+0',
        },
        ...(app.connection as Partial<TypeOrmModuleOptions>),
      }),
    );
  });
  return imports;
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    ...dbImports(),
    ServeStaticModule.forRoot({
      exclude: ['/api*'],
      rootPath: join(__dirname, '..', 'public', 'client'),
      serveRoot: '/',
    }),

    ServeStaticModule.forRoot({
      exclude: ['/api*'],
      rootPath: join(__dirname, '..', 'public', 'images'),
      serveRoot: '/avatars/',
    }),
    InboxLogModule,
    JovoAppModule,
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
