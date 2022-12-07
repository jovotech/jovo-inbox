import { Injectable } from '@nestjs/common';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import {
  GetLastConversationsDto,
  InboxLog,
  InboxLogType,
  SelectUserConversationsDto,
  UserConversationsResponse,
} from 'jovo-inbox-core';
import { Between, FindManyOptions, getRepository, MoreThan } from 'typeorm';
import { LOGS_PER_REQUEST } from '../../constants';
import { InboxLogUserEntity } from '../../entity/inbox-log-user.entity';

@Injectable()
export class InboxLogService {
  async getConversations(
    getLastConversationsDto: GetLastConversationsDto,
  ): Promise<any> {
    const last = getLastConversationsDto.last || new Date();
    const take = getLastConversationsDto.search ? 1000 : 15;

    // search in user name mappings

    let foundMappingIds: number[] = [0];
    let foundLogs = [];

    if (getLastConversationsDto.search) {
      const qb1 = await getRepository(InboxLogEntity).createQueryBuilder(
        'inboxlog',
      );

      const mappingSubQuery = qb1
        .subQuery()
        .select('platformUserId')
        .from(InboxLogUserEntity, 'loguser')
        .where('loguser.appId = :appId', {
          appId: getLastConversationsDto.appId,
        })
        .andWhere('loguser.name LIKE :name', {
          name: `%${getLastConversationsDto.search}%`,
        });

      const subQuery1 = qb1
        .subQuery()
        .select('MAX(id)')
        .from(InboxLogEntity, 'log')
        .where('log.type = :type')
        .andWhere('log.userId IN  ' + mappingSubQuery.getQuery())
        .groupBy('log.userId');
      qb1
        .where('inboxlog.id IN ' + subQuery1.getQuery())
        .andWhere('appId = :appId')

        .setParameter('type', InboxLogType.Response)
        .setParameter('last', last)
        .setParameter('appId', getLastConversationsDto.appId)
        .orderBy('inboxlog.id', 'DESC');

      const foundInMappings = await qb1.getMany();
      foundLogs = foundLogs.concat(foundInMappings);

      if (foundInMappings.length > 0) {
        foundMappingIds = foundInMappings.map((log: InboxLog) => log.id);
      }
    }

    // search in logs

    const qb = await getRepository(InboxLogEntity).createQueryBuilder(
      'inboxlog',
    );
    const subQuery = qb
      .subQuery()
      .select('MAX(id)')
      .from(InboxLogEntity, 'log')
      .where('log.type = :type')
      .andWhere('log.createdAt < :last')

      .andWhere('log.id NOT IN (:...foundMappingIds)', { foundMappingIds })
      .groupBy('log.appId')
      .addGroupBy('log.userId');

    if (getLastConversationsDto.search) {
      subQuery.andWhere('log.userId LIKE :userId', {
        userId: `%${getLastConversationsDto.search}%`,
      });
    }

    if (getLastConversationsDto.withErrors) {
      const errorsSubQuery = qb
        .subQuery()
        .select('userId')
        .from(InboxLogEntity, 'log')
        .where('log.type = :errortype', { errortype: InboxLogType.Error })
        .groupBy('log.userId');

      subQuery.andWhere('log.userId IN ' + errorsSubQuery.getQuery());
    }

    if (getLastConversationsDto.platform) {
      const platformSubQuery = qb
        .subQuery()
        .select('userId')
        .from(InboxLogEntity, 'log')
        .where('log.platform = :platform', {
          platform: getLastConversationsDto.platform,
        })
        .groupBy('log.userId');

      subQuery.andWhere('log.userId IN ' + platformSubQuery.getQuery());
    }

    qb.where('inboxlog.id IN ' + subQuery.getQuery())
      .andWhere('appId = :appId')
      .andWhere('inboxlog.createdAt < :last')
      .setParameter('type', InboxLogType.Response)
      .setParameter('last', last)
      .setParameter('appId', getLastConversationsDto.appId)
      .orderBy('inboxlog.id', 'DESC')
      .take(take);

    if (getLastConversationsDto.search) {
      qb.andWhere('userId LIKE :userId', {
        userId: `%${getLastConversationsDto.search}%`,
      });
    }

    foundLogs = foundLogs.concat(await qb.getMany());

    return foundLogs;
  }
  async getUserConversations(
    selectUserConversationsDto: SelectUserConversationsDto,
  ): Promise<UserConversationsResponse> {
    const conditions: FindManyOptions<InboxLog> = {
      where: {
        appId: selectUserConversationsDto.appId,
        userId: selectUserConversationsDto.userId,
      },
      take: LOGS_PER_REQUEST,
      order: {
        createdAt: 'ASC',
      },
    };

    if (selectUserConversationsDto.last) {
      // @ts-ignore
      conditions.where.createdAt = MoreThan(selectUserConversationsDto.last);
    }

    if (selectUserConversationsDto.lastId) {
      // @ts-ignore
      conditions.where.id = MoreThan(selectUserConversationsDto.lastId);
    }

    const result = await getRepository(InboxLogEntity).findAndCount(conditions);

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

  async getPlatforms(appId: string) {
    const qb = getRepository(InboxLogEntity).createQueryBuilder('inboxlog');

    qb.select('platform')
      .where('appId = :appId')
      .setParameter('appId', appId)
      .groupBy('platform')
      .orderBy('platform', 'ASC');

    const rawResult = await qb.getRawMany();

    return rawResult.map((item: { platform: string }) => item.platform);
  }

  async exportLogs(appId: string, from?: Date, to?: Date) {
    if (!to) {
      to = new Date();
    }

    const options: FindManyOptions<InboxLog> = {
      where: [
        {
          appId,
          createdAt: Between(from, to),
        },
      ],
      order: {
        userId: 'DESC',
        id: 'ASC',
      },
    };

    return await getRepository(InboxLogEntity).find(options);
  }

  // async exportLogsToCsv(appId: string, from?: Date, to?: Date) {
  //   const logs = await this.exportLogs(appId, from, to);
  //
  //   const platforms: InboxPlatform[] = [
  //   ];
  //
  //   const options = {
  //     fieldSeparator: ',',
  //     quoteStrings: '"',
  //     decimalSeparator: '.',
  //     showLabels: true,
  //     showTitle: true,
  //     title: `Exported data: ${appId}`,
  //     useTextFile: false,
  //     useBom: true,
  //     useKeysAsHeaders: true,
  //   };
  //
  //   const csvExporter = new ExportToCsv(options);
  //
  //   const data: Partial<ExportInboxLog>[] = [];
  //
  //   let lastUser = '';
  //   for (let i = 0; i < logs.length; i++) {
  //     const log = logs[i];
  //     const row: Partial<ExportInboxLog> = {};
  //
  //     // user id
  //     if (lastUser !== log.userId) {
  //       row.userId = log.userId;
  //       lastUser = log.userId;
  //     } else {
  //       row.userId = '';
  //     }
  //
  //     const platformRequest = InboxPlatform.getPlatformRequest(log, platforms);
  //
  //     // user said
  //     row.userSaid = platformRequest ? platformRequest.getPlainText() : '';
  //
  //     const platformResponse = InboxPlatform.getPlatformResponse(
  //       log,
  //       platforms,
  //     );
  //
  //     // bot said
  //     row.botSaid = platformResponse
  //       ? platformResponse
  //           .getSpeechPlain()
  //           .replace(/<[^>]*>?/gm, '')
  //           .replace(/&nbsp;/g, ' ')
  //       : '';
  //     // intent
  //     row.intent = platformResponse?.getNluPlain()
  //       ? platformResponse?.getNluPlain()
  //       : '';
  //
  //     row.timestamp = log.createdAt.toISOString();
  //     data.push(row);
  //   }
  //
  //   return csvExporter.generateCsv(data, true);
  // }
}
