import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      entities: [InboxLogEntity, InboxLogUserEntity],
      synchronize: true,
      ...(config.apps[0].connection as Partial<TypeOrmModuleOptions>),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      serveRoot: '/public/',
    }),
    InboxLogModule,
    JovoAppModule,
    InboxLogUserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
