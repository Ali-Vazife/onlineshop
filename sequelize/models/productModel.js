const { DataTypes } = require('sequelize');

const defineModels = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ShortDescription: {
        type: DataTypes.STRING,
      },
      coverImage: {
        type: DataTypes.STRING,
        default: 'defaultp.png',
      },
    },
    {
      freezeTableName: true,
      createdAt: 'productCreatedAt',
      updatedAt: 'productUpdatedAt',
    },
  );

  const ProductGender = sequelize.define(
    'ProductGender',
    {
      name: {
        type: DataTypes.ENUM('Men', 'Women', 'Unisex'),
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  const Category = sequelize.define(
    'Category',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  const ProductCategory = sequelize.define(
    'ProductCategory',
    {},
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  const Brand = sequelize.define(
    'Brand',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  const Discount = sequelize.define(
    'Discount',
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endtDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      createdAt: 'discountCreatedAt',
      updatedAt: 'discountUpdatedAt',
    },
  );

  const Variant = sequelize.define(
    'Variant',
    {
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      qtyInStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skuNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  const Attribute = sequelize.define(
    'Attribute',
    {
      type: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  const VariantAttribute = sequelize.define(
    'VariantAttribute',
    {},
    {
      freezeTableName: true,
      timestamps: false,
    },
  );

  return {
    Product,
    Category,
    ProductCategory,
    ProductGender,
    Brand,
    Discount,
    Variant,
    Attribute,
    VariantAttribute,
  };
};

module.exports = defineModels;
