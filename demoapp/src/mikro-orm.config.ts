import { InboxLog } from './entities/InboxLog';
import { Options } from '@mikro-orm/core';

export const config: Options = {
  dbName: process.env.MYSQL_DATABASE || 'jovo-inbox',
  type: 'mysql',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  // as we are using class references here, we don't need to specify `entitiesTs` option
  entities: [InboxLog],
  discovery: { disableDynamicFileAccess: true },
  // debug: true,
};

export default config;
