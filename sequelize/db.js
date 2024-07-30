const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const defineUserModels = require('./models/userModel');
const defineProductModels = require('./models/productModel');
const { applyAssociations } = require('./associations');

dotenv.config({ path: 'config.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logQueryParameters: true,
    benchmark: true,
  },
);

// const sequelize = new Sequelize(
// process.env.DB_NAME,
// process.env.DB_USER,
// process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 5432,
//     dialect: 'postgres',
//     logQueryParameters: true,
//     benchmark: true,
//   },
// );

const userModel = defineUserModels(sequelize);
const productModel = defineProductModels(sequelize);

applyAssociations(userModel, productModel);

module.exports = {
  sequelize,
  ...userModel,
  ...productModel,
};
