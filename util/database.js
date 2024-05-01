const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'eccommmerce-practice',
  'postgres',
  'postgres',
  {
    host: 'localhost',
    dialect: 'postgres',
  },
);

module.exports = sequelize;
