module.exports = {
  entities: ['./src/entity'],

  type: 'mysql', // one of `mongo` | `mysql` | `mariadb` | `postgresql` | `sqlite`

  dbName: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
};
