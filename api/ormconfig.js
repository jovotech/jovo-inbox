// eslint-disable-next-line no-undef
module.exports = {
  type: 'mysql',
  synchronize: true,
  logging: false,
  logger: 'simple-console',
  // eslint-disable-next-line no-undef
  host: process.env.INBOX_MYSQL_HOST,
  port: 3306,
  // eslint-disable-next-line no-undef
  username: process.env.INBOX_MYSQL_USER,
  // eslint-disable-next-line no-undef
  password: process.env.INBOX_MYSQL_PASSWORD,
  // eslint-disable-next-line no-undef
  database: process.env.INBOX_MYSQL_DATABASE,
  entities: ['src/entity/**/*.ts'],
};
