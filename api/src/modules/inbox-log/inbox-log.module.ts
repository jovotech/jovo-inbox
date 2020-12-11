import { Module } from '@nestjs/common';
import { InboxLogController } from './inbox-log.controller';
import { InboxLogService } from './inbox-log.service';
import { OrmModule } from '../orm/orm.module';

@Module({
  imports: [OrmModule],
  controllers: [InboxLogController],
  providers: [InboxLogService],
})
export class InboxLogModule {}
