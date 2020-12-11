import { Controller, Get, Param, Query } from '@nestjs/common';
import { InboxLogService } from './inbox-log.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { InboxLogEntity } from '../../entities/inbox-log.entity';
import { EntityRepository } from '@mikro-orm/core';

@Controller('inboxlog')
export class InboxLogController {
  // constructor(private readonly inboxLogService: InboxLogService) {}
  constructor(
    @InjectRepository(InboxLogEntity)
    private readonly inboxLogRepository: EntityRepository<InboxLogEntity>,
    private readonly inboxLogService: InboxLogService,
  ) {}

  @Get()
  getHello(): any {
    return this.inboxLogService.getConversations();
  }

  @Get('user/:userId')
  getUserConversation(@Param('userId') userId: string): any {
    console.log(userId);
    return this.inboxLogService.getUserConversations(userId);
  }
}
