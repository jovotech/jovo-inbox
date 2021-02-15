import { Injectable } from '@nestjs/common';
import { MikroORM, QueryOrder } from '@mikro-orm/core';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import {
  GetLastConversationsDto,
  InboxLog,
  InboxLogType,
  SelectUserConversationsDto,
} from 'jovo-inbox-core';
import {
  EntityManager,
  FindOneOptions,
  getRepository,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserConversationsResponse } from 'jovo-inbox-core/dist/UserConversationsResponse';
import { LOGS_PER_REQUEST } from '../../constants';
import { connectionName } from '../../util';

@Injectable()
export class InboxLogService {
  async getConversations(
    getLastConversationsDto: GetLastConversationsDto,
  ): Promise<any> {
    const qb = await getRepository(
      InboxLogEntity,
      connectionName(getLastConversationsDto.appId),
    ).createQueryBuilder('inboxlog');
    const logs = await qb
      .where(
        'inboxlog.id IN ' +
          qb
            .subQuery()
            .select('MAX(id)')
            .from(InboxLogEntity, 'log')
            .where('log.type = :type')
            .groupBy('log.userId')
            .getQuery(),
      )
      .andWhere('appId = :appId')
      .setParameter('type', InboxLogType.REQUEST)
      .setParameter('appId', getLastConversationsDto.appId)
      .orderBy('inboxlog.id', 'DESC')
      .getMany();

    return logs;
  }
  //
  async getUserConversations(
    selectUserConversationsDto: SelectUserConversationsDto,
  ): Promise<UserConversationsResponse> {
    const result = await getRepository(
      InboxLogEntity,
      connectionName(selectUserConversationsDto.appId),
    ).findAndCount({
      where: {
        appId: selectUserConversationsDto.appId,
        userId: selectUserConversationsDto.userId,
      },
      take: LOGS_PER_REQUEST,
      order: {
        createdAt: 'ASC',
      },
    });

    // time of last item in pagination
    const last =
      result[1] > LOGS_PER_REQUEST
        ? result[0][result[0].length - 1].createdAt
        : undefined;
    return {
      logs: result[0],
      last,
    };
  }
}
