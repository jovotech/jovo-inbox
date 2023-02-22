const host = process.env.MYSQL_HOST || 'localhost';
const username = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || 'root';
const database = process.env.MYSQL_DATABASE || 'jovoinbox';
const port = process.env.MYSQL_PORT || 3306;

module.exports = {
  type: 'mysql',
  synchronize: true,
  logging: false,
  logger: 'simple-console',
  host,
  port,
  username,
  password,
  database,
  entities: ['dist/**/*.entity{.ts,.js}'],
  charset: 'utf8mb4_unicode_ci',
  migrations: ['dist/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
