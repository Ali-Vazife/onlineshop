const { Sequelize, DataTypes } = require('sequelize');
// const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    ShortDescription: {
      type: Sequelize.STRING,
    },
    coverImage: {
      type: Sequelize.STRING,
      default: 'defaultp.png',
    },
  },
  {
    freezeTableName: true,
  },
);

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

const Discount = sequelize.define(
  'Discount',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    categoryId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endtDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    percent: {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  },
);

const ProductItem = sequelize.define(
  'ProductItem',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
    },
  },
  {
    freezeTableName: true,
  },
);

const VariationId = sequelize.define(
  'VariationId',
  {
    productId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    sizeId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    colorId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    qtyInStock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

const SizeOption = sequelize.define(
  'SizeOption',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    option: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

const ColorOption = sequelize.define(
  'ColorOption',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    option: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

module.exports = {
  Product,
  Category,
  Discount,
  ProductItem,
  VariationId,
  SizeOption,
  ColorOption,
};
