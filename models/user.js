const { Sequelize, Op, Model, DataTypes } = require('sequelize');

const sequelize = require('../util/database');

const UserAccount = sequelize.define(
  'UserAccount',
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    addressId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    userRoleId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    likeId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
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
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    emailAddress: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emailIsVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    confirmationToken: {
      type: Sequelize.STRING,
      // allowNull: true,
    },
    passwordResetToken: {
      type: Sequelize.STRING,
      // allowNull: true,
    },
    passwordChangedAt: {
      type: Sequelize.DATE,
    },
    passwordResetExpire: {
      type: Sequelize.DATE,
    },
    active: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
  },
  {
    freezeTableName: true,
  },
);
// DON'T FORGET TO EXCLUDE password & active FROM QUERY RESULT

const UserRole = sequelize.define(
  'UserRole',
  {
    id: {
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    role: {
      type: Sequelize.STRING,
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
    id: {
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    state: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    street: {
      type: Sequelize.STRING,
    },
    postalCode: {
      type: Sequelize.STRING,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  },
);

const UserLike = sequelize.define(
  'UserLike',
  {
    id: {
      type: Sequelize.UUID,
      default: Sequelize.UUIDV4,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    productItemId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  },
);

module.exports = { UserAccount, UserLogin, UserRole, UserAddress, UserLike };
