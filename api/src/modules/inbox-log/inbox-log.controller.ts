import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InboxLogService } from './inbox-log.service';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import { SelectUserConversationsDto } from 'jovo-inbox-core';
import { UserConversationsResponse } from 'jovo-inbox-core/dist/UserConversationsResponse';

@Controller('inboxlog')
export class InboxLogController {
  // constructor(private readonly inboxLogService: InboxLogService) {}
  constructor(private readonly inboxLogService: InboxLogService) {}

  @Get()
  getHello(): any {
    return this.inboxLogService.getConversations();
  }

  @Post('user/conversation')
  getUserConversation(
    @Body() selectUserConversationsDto: SelectUserConversationsDto,
  ): Promise<UserConversationsResponse> {
    return this.inboxLogService.getUserConversations(
      selectUserConversationsDto,
    );
  }
}
