const Sequelize = require('sequelize');

const defineUserModels = require('./models/userModel');
const defineProductModels = require('./models/productModel');
const { applyAssociations } = require('./associations');

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
