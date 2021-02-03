import { Log, PluginConfig, Project } from 'jovo-core';
import _merge = require('lodash.merge');
import { DataEntry, JovoInboxDb } from './interfaces';
import { EntityManager, MikroORM, MikroORMOptions } from '@mikro-orm/core';
import { InboxLog, InboxLogType } from '../entities/InboxLog';
import * as path from 'path';
export interface SqlInboxConfig extends PluginConfig, Partial<MikroORMOptions> {}

export class SqlInbox implements JovoInboxDb {
  config: SqlInboxConfig = {
    entities: ['./src/entity'], // path to your JS entity (dist), relative to `baseDir`
    // entitiesTs: [path.resolve(Project.getProjectPath(), 'dist', 'src/entity')],
    dbName: 'jovoinbox',
    type: 'mysql',
    host: 'localhost',
    user: 'root',
    password: '',
    discovery: { disableDynamicFileAccess: true },
  };
  orm?: MikroORM;

  constructor(config?: SqlInboxConfig) {
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  async init() {
    if (!this.orm) {
      this.orm = await MikroORM.init();
    }
  }
  errorHandling() {}
  async add(inboxLog: InboxLog) {
    await this.init();
    this.errorHandling();

    await this.orm!.em.transactional(async (em: EntityManager) => {
      await em.persistAndFlush(inboxLog);
    });
  }

  async close() {
    if (this.orm) {
      await this.orm.close(true);
    }
  }
}
