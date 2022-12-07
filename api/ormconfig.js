// eslint-disable-next-line no-undef
module.exports = {
  type: 'mysql',
  synchronize: true,
  logging: false,
  logger: 'simple-console',
  // eslint-disable-next-line no-undef
  host: process.env.MYSQL_HOST,
  port: 3306,
  // eslint-disable-next-line no-undef
  username: process.env.MYSQL_USER,
  // eslint-disable-next-line no-undef
  password: process.env.MYSQL_PASSWORD,
  // eslint-disable-next-line no-undef
  database: process.env.MYSQL_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  charset: 'utf8mb4_unicode_ci',
};
