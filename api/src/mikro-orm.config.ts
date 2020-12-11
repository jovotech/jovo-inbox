import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { InboxLogEntity } from './entities/inbox-log.entity';

const logger = new Logger('MikroORM');
const config = {
  entities: [InboxLogEntity],
  dbName: process.env.INBOX_MYSQL_DATABASE as string,
  type: 'mysql',
  host: process.env.INBOX_MYSQL_HOST as string,
  user: process.env.INBOX_MYSQL_USER as string,
  password: process.env.INBOX_MYSQL_PASSWORD as string,
  autoLoadEntities: true,
  logger: logger.log.bind(logger),
} as Options;

export default config;
