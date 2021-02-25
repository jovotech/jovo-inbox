import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InboxLogService } from './inbox-log.service';
import {
  GetLastConversationsDto,
  SelectUserConversationsDto,
} from 'jovo-inbox-core';
import { UserConversationsResponse } from 'jovo-inbox-core/dist/UserConversationsResponse';

@Controller('inboxlog')
export class InboxLogController {
  constructor(private readonly inboxLogService: InboxLogService) {}

  @Post()
  getLastConversations(
    @Body() getLastConversationsDto: GetLastConversationsDto,
  ): Promise<any> {
    return this.inboxLogService.getConversations(getLastConversationsDto);
  }

  @Post('user/conversation')
  getUserConversation(
    @Body() selectUserConversationsDto: SelectUserConversationsDto,
  ): Promise<UserConversationsResponse> {
    return this.inboxLogService.getUserConversations(
      selectUserConversationsDto,
    );
  }

  @Get('platform/:appId')
  getPlatforms(@Param('appId') appId: string): Promise<any> {
    return this.inboxLogService.getPlatforms(appId);
  }
}
