import { InboxConfig } from './modules/interfaces';

export = {
  apps: [
    {
      name: process.env.APP1_NAME,
      id: process.env.APP1_ID,
      connection: {
        type: process.env.APP1_DB_TYPE,
        host: process.env.APP1_DB_HOST,
        port: process.env.APP1_DB_PORT || 3306,
        synchronize: true,
        username: process.env.APP1_DB_USER,
        password: process.env.APP1_DB_PASSWORD,
        database: process.env.APP1_DB_DATABASE,
      },
    },
  ],
} as InboxConfig;
