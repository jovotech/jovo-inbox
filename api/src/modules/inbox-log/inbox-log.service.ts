import { Injectable } from '@nestjs/common';
import { MikroORM, QueryOrder } from '@mikro-orm/core';
import { InboxLogEntity } from '../../entities/inbox-log.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InboxLog } from 'jovo-inbox-core';

@Injectable()
export class InboxLogService {
  constructor(
    @InjectRepository(InboxLogEntity)
    private readonly inboxLogRepository: EntityRepository<InboxLogEntity>,
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}
  async getConversations(): Promise<any> {
    const res = await this.em
      .createQueryBuilder(InboxLogEntity)
      .groupBy('userId')
      .where({
        appId: 'studios-nba-jovo-inbox',
      })
      .orderBy({
        createdAt: QueryOrder.DESC,
      })
      .limit(10)
      .execute();

    return res.map((item: InboxLogEntity) => {
      return {
        ...item,
        payload: JSON.parse(item.payload),
      };
    });
  }

  async getUserConversations(userId: string): Promise<InboxLog[]> {
    const q = this.em
      .createQueryBuilder(InboxLogEntity)
      .where({
        appId: 'studios-nba-jovo-inbox',
        userId,
      })
      .orderBy({
        createdAt: QueryOrder.ASC,
      })
      .limit(100);

    const res = await q.execute();

    return res.map((item: InboxLogEntity) => {
      return {
        ...item,
        payload: JSON.parse(item.payload),
      };
    });
  }
}
