export = {
  apps: [
    {
      name: `Sam's Coffee`,
      id: 'test',
      connection: {
        type: 'mysql',
        host: process.env.INBOX_MYSQL_HOST,
        port: 3306,
        synchronize: true,
        // eslint-disable-next-line no-undef
        username: process.env.INBOX_MYSQL_USER,
        // eslint-disable-next-line no-undef
        password: process.env.INBOX_MYSQL_PASSWORD,
        // eslint-disable-next-line no-undef
        database: process.env.INBOX_MYSQL_DATABASE,
      },
    },
  ],
};
