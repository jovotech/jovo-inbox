import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { InboxLogModule } from './modules/inbox-log/inbox-log.module';
import { OrmModule } from './modules/orm/orm.module';

@Module({
  imports: [ConfigModule.forRoot(), OrmModule, InboxLogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
