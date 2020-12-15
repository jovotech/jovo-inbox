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
    // TODO: Temporary!
    const results = await this.em.getConnection().execute(`    SELECT *
                            FROM inbox_log
                            WHERE id IN (
                                SELECT MAX(id)
                                FROM inbox_log
                                WHERE type = 0
                                GROUP BY user_id
                            )
                            ORDER BY created_at DESC`);

    const repo = this.orm.em.getRepository(InboxLogEntity);
    const logs = results.map(log => repo.map(log));

    // const res = await this.em
    //   .createQueryBuilder(InboxLogEntity)
    //   .select([
    //     'userId',
    //     'appId',
    //     'payload',
    //     'id',
    //     'max(created_at) as createdAt',
    //   ])
    //   .where({
    //     appId: 'studios-nba-jovo-inbox',
    //   })
    //   .groupBy('userId')
    //
    //   .orderBy({
    //     createdAt: QueryOrder.DESC,
    //   })
    //   // .limit(10)
    //   .execute();

    return logs.map((item: InboxLogEntity) => {
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
