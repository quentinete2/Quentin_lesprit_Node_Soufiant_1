require('dotenv').config();

module.exports = {
  development: {
    dialect: 'mariadb',
    host: process.env.MARIADB_HOST || 'serve_backend-db',
    port: Number(process.env.MARIADB_PORT || 3306),
    username: process.env.MARIADB_USERNAME || 'root',
    password: process.env.MARIADB_PASSWORD || 'root',
    database: process.env.MARIADB_DATABASE || 'utilisateurs',
  },
  test: {
    dialect: 'mariadb',
    host: process.env.TEST_DB_HOST || '127.0.0.1',
    port: Number(process.env.TEST_DB_PORT || 3306),
    username: process.env.TEST_DB_USER || 'root',
    password: process.env.TEST_DB_PASSWORD || '',
    database: process.env.TEST_DB_NAME || 'database_test',
  },
  production: {
    dialect: 'mariadb',
    host: process.env.PROD_DB_HOST,
    port: Number(process.env.PROD_DB_PORT || 3306),
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
  },
};