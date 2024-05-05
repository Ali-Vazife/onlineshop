const { DataTypes } = require('sequelize');

const defineModels = (sequelize) => {
  const UserAccount = sequelize.define(
    'UserAccount',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    },
  );

  const UserLogin = sequelize.define(
    'UserLogin',
    {
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailIsVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmationToken: {
        type: DataTypes.STRING,
      },
      passwordResetToken: {
        type: DataTypes.STRING,
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
      },
      passwordResetExpire: {
        type: DataTypes.DATE,
      },
      active: {
        type: DataTypes.BOOLEAN,
        default: true,
      },
    },
    {
      freezeTableName: true,
    },
  );

  const UserRole = sequelize.define(
    'UserRole',
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    },
  );

  const UserAddress = sequelize.define(
    'UserAddress',
    {
      state: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      street: {
        type: DataTypes.STRING,
      },
      postalCode: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
    },
  );

  const UserLike = sequelize.define(
    'UserLike',
    {
    },
    {
      freezeTableName: true,
    },
  );

  return {
    UserAccount,
    UserLogin,
    UserRole,
    UserAddress,
    UserLike,
  };
};

module.exports = defineModels;
