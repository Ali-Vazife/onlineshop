const { DataTypes } = require('sequelize');

const defineModels = (sequelize) => {
  const Product = sequelize.define(
    'Product',
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // category: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
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
    },
  );

  const Category = sequelize.define(
    'Category',
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    },
  );

  const Brand = sequelize.define(
    'Brand',
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      name: {
        type: DataTypes.STRING,
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
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      // categoryId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
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
    },
  );

  const ProductItem = sequelize.define(
    'ProductItem',
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      // productId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      freezeTableName: true,
    },
  );

  const VariationId = sequelize.define(
    'VariationId',
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      // productId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
      // sizeId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
      // colorId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      // },
      qtyInStock: {
        type: DataTypes.INTEGER,
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
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      option: {
        type: DataTypes.STRING,
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
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      //   allowNull: false,
      //   primaryKey: true,
      // },
      option: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    },
  );

  return {
    Product,
    Category,
    Brand,
    Discount,
    ProductItem,
    VariationId,
    SizeOption,
    ColorOption,
  };
};

module.exports = defineModels;
