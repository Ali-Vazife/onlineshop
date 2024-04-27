module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_development',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
