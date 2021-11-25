import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InboxLogService } from './inbox-log.service';
import {
  GetLastConversationsDto,
  SelectUserConversationsDto,
  UserConversationsResponse,
} from 'jovo-inbox-core';

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

  @Get('export')
  @Header('Content-type', 'text/csv; charset=utf-8')
  async exportLog(
    @Query('appId') appId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.inboxLogService.exportLogsToCsv(
      appId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }
}
