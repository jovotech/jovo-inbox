import { Module } from '@nestjs/common';
import { InboxLogController } from './inbox-log.controller';
import { InboxLogService } from './inbox-log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxLogEntity } from '../../entity/inbox-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InboxLogEntity])],
  controllers: [InboxLogController],
  providers: [InboxLogService],
})
export class InboxLogModule {}
