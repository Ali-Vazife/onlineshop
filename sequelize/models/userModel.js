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
      UserRoleId: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      createdAt: 'UserAccountCreatedAt', // Change the default createdAt column name
      updatedAt: 'UserAccountUpdatedAt', // Change the default updatedAt column name
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
      passwordConfirm: {
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
      createdAt: 'loginCreatedAt', // Change the default createdAt column name
      updatedAt: 'loginUpdatedAt', // Change the default updatedAt column name
    },
  );

  const UserRole = sequelize.define(
    'UserRole',
    {
      role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin', 'owner'],
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
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
      createdAt: 'addressCreatedAt', // Change the default createdAt column name
      updatedAt: 'addressUpdatedAt', // Change the default updatedAt column name
    },
  );

  const UserLike = sequelize.define(
    'UserLike',
    {},
    {
      freezeTableName: true,
      timestamps: false,
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
