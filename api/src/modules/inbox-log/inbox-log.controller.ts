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
  AddInboxLogDto,
  GetLastConversationsDto,
  SelectUserConversationsDto,
  UserConversationsResponse,
} from 'jovo-inbox-core';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import { getConnection } from 'typeorm';

@Controller('logs')
export class InboxLogController {
  constructor(private readonly inboxLogService: InboxLogService) {}

  @Post()
  async addInboxLog(
    @Body() inboxLog: AddInboxLogDto | AddInboxLogDto[],
  ): Promise<void> {
    const logs = Array.isArray(inboxLog) ? inboxLog : [inboxLog];
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(InboxLogEntity)
      .values(logs.map((log) => ({ ...log })))
      .execute();
  }

  @Post('conversations')
  getLastConversations(@Body() dto: GetLastConversationsDto): Promise<any> {
    return this.inboxLogService.getConversations(dto);
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
    // TODO: temporary not useable
    // return this.inboxLogService.exportLogsToCsv(
    //   appId,
    //   from ? new Date(from) : undefined,
    //   to ? new Date(to) : undefined,
    // );
  }
}
