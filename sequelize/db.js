const Sequelize = require('sequelize');
const dotenv = require('dotenv');
const defineUserModels = require('./models/userModel');
const defineProductModels = require('./models/productModel');
const { applyAssociations } = require('./associations');

dotenv.config({ path: 'config.env' });

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'postgres',
//     logQueryParameters: true,
//     benchmark: true,
//   },
// );

const sequelize = new Sequelize('ecc', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logQueryParameters: true,
  benchmark: true,
});

const userModel = defineUserModels(sequelize);
const productModel = defineProductModels(sequelize);

applyAssociations(userModel, productModel);

module.exports = {
  sequelize,
  ...userModel,
  ...productModel,
};
