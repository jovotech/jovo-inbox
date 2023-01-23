import { Module } from '@nestjs/common';
import { InboxLogController } from './inbox-log.controller';
import { InboxLogService } from './inbox-log.service';

@Module({
  imports: [],
  controllers: [InboxLogController],
  providers: [InboxLogService],
})
export class InboxLogModule {}
