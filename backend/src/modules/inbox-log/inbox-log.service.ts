import { Injectable } from '@nestjs/common';
import { InboxLogEntity } from '../../entity/inbox-log.entity';
import {
  GetLastConversationsDto,
  getOutputText,
  getPlatformRequest,
  getPlatformResponseOutputTemplate,
  InboxLog,
  InboxLogType,
  Interaction,
  SelectUserConversationsDto,
  UserConversationsResponse,
} from 'jovo-inbox-core';
import { Between, FindManyOptions, getRepository, MoreThan } from 'typeorm';
import { LOGS_PER_REQUEST } from '../../constants';
import { InboxLogUserEntity } from '../../entity/inbox-log-user.entity';
import { ExportToCsv } from 'export-to-csv';
import { ExportInboxLog } from '../interfaces';

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
        .where('loguser.projectId = :projectId', {
          projectId: getLastConversationsDto.projectId,
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
        .andWhere('projectId = :projectId')

        .setParameter('type', InboxLogType.Response)
        .setParameter('last', last)
        .setParameter('projectId', getLastConversationsDto.projectId)
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
      .groupBy('log.projectId')
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
      .andWhere('projectId = :projectId')
      .andWhere('inboxlog.createdAt < :last')
      .setParameter('type', InboxLogType.Response)
      .setParameter('last', last)
      .setParameter('projectId', getLastConversationsDto.projectId)
      .orderBy('inboxlog.id', 'DESC')
      .take(take);

    if (getLastConversationsDto.search) {
      qb.andWhere('userId LIKE :userId', {
        userId: `%${getLastConversationsDto.search}%`,
      });
    }

    foundLogs = foundLogs.concat(await qb.getMany());

    // create array with extracted requestId from foundlogs
    const requestIds = foundLogs.map((log: InboxLog) => log.requestId);

    if (requestIds.length === 0) {
      return [];
    }

    const q = getRepository(InboxLogEntity)
      .createQueryBuilder('inboxlog')
      .where('requestId IN (:...requestIds)', { requestIds });

    const interactionLogs = await q.getMany();

    const interactions: Record<string, Interaction> = {};

    for (let i = 0; i < interactionLogs.length; i++) {
      const conversation = interactionLogs[i];

      if (!interactions[conversation.requestId]) {
        interactions[conversation.requestId] = {
          requestId: conversation.requestId,
          logs: [],
          start: new Date(conversation.createdAt),
          hasSessionStarted: false,
        };
      }
      interactions[conversation.requestId].logs.push(conversation);
    }

    return Object.values(interactions).sort((a, b) => {
      return b.start.getTime() - a.start.getTime();
    });
  }
  async getUserConversations(
    selectUserConversationsDto: SelectUserConversationsDto,
  ): Promise<UserConversationsResponse> {
    const conditions: FindManyOptions<InboxLog> = {
      where: {
        projectId: selectUserConversationsDto.projectId,
        userId: selectUserConversationsDto.userId,
      },
      take: LOGS_PER_REQUEST,
      order: {
        createdAt: 'ASC',
      },
    };

    if (selectUserConversationsDto.last) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      conditions.where.createdAt = MoreThan(selectUserConversationsDto.last);
    }

    if (selectUserConversationsDto.lastId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

  async getPlatforms(projectId: string) {
    const qb = getRepository(InboxLogEntity).createQueryBuilder('inboxlog');

    qb.select('platform')
      .where('projectId = :projectId')
      .setParameter('projectId', projectId)
      .groupBy('platform')
      .orderBy('platform', 'ASC');

    const rawResult = await qb.getRawMany();

    return rawResult.map((item: { platform: string }) => item.platform);
  }

  async exportLogs(projectId: string, from?: Date, to?: Date) {
    if (!to) {
      to = new Date();
    }

    const options: FindManyOptions<InboxLog> = {
      where: [
        {
          projectId,
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

  async exportLogsToCsv(projectId: string, from?: Date, to?: Date) {
    const logs = await this.exportLogs(projectId, from, to);

    const interactions: Record<string, Interaction> = {};

    for (let i = 0; i < logs.length; i++) {
      const conversation = logs[i];

      if (!interactions[conversation.requestId]) {
        interactions[conversation.requestId] = {
          requestId: conversation.requestId,
          logs: [],
          start: new Date(conversation.createdAt),
          hasSessionStarted: false,
        };
      }
      interactions[conversation.requestId].logs.push(conversation);
    }

    const sorted = Object.values(interactions).sort((a, b) => {
      return b.start.getTime() - a.start.getTime();
    });

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Exported data: ${projectId}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };

    const csvExporter = new ExportToCsv(options);

    const data: Partial<ExportInboxLog>[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const interaction = sorted[i];
      const row: Partial<ExportInboxLog> = {};

      row.userId = interaction.logs[0].userId;

      const platformRequestLog = interaction.logs.find(
        (log) => log.type === 'request',
      );

      const platformRequest = getPlatformRequest(platformRequestLog);
      row.userSaid = platformRequest.text;

      const platformResponseLog = interaction.logs.find(
        (log) => log.type === 'response',
      );

      const outputTemplate = await getPlatformResponseOutputTemplate(
        platformResponseLog,
      );
      if (outputTemplate && outputTemplate.length > 0) {
        const lastOutput = outputTemplate[outputTemplate.length - 1];

        // bot said
        row.botSaid = getOutputText(lastOutput);
      }

      // intent
      const nluLog = interaction.logs.find((log) => log.type === 'nlu');
      row.intent = nluLog?.payload.intent?.name;

      row.timestamp = platformRequestLog.createdAt.toISOString();
      data.push(row);
    }

    return csvExporter.generateCsv(data, true);
  }
}
