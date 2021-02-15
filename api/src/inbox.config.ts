import { InboxConfig } from './modules/interfaces';

export = {
  apps: [
    {
      name: `Sam's Coffee`,
      id: 'test',
      connection: {
        type: 'mysql',
        host: process.env.INBOX_MYSQL_HOST,
        port: process.env.INBOX_MYSQL_PORT || 3306,
        synchronize: true,
        username: process.env.INBOX_MYSQL_USER,
        password: process.env.INBOX_MYSQL_PASSWORD,
        database: process.env.INBOX_MYSQL_DATABASE,
      },
    },
    {
      name: process.env.APP_INBOX_APP_NAME,
      id: process.env.APP_INBOX_APP_ID,
      connection: {
        type: 'mysql',
        host: process.env.APP_INBOX_MYSQL_HOST,
        port: process.env.INBOX_MYSQL_PORT || 3306,
        synchronize: true,
        username: process.env.APP_INBOX_MYSQL_USER,
        password: process.env.APP_INBOX_MYSQL_PASSWORD,
        database: process.env.APP_INBOX_MYSQL_DATABASE,
      },
    },
  ],
} as InboxConfig;
