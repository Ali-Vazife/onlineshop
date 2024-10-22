const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

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
      image: {
        type: DataTypes.STRING,
        defaultValue: 'defaultUser.png',
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
      createdAt: 'UserAccountCreatedAt',
      updatedAt: 'UserAccountUpdatedAt',
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
        defaultValue: true,
      },
    },
    {
      freezeTableName: true,
      createdAt: 'loginCreatedAt',
      updatedAt: 'loginUpdatedAt',
    },
  );

  UserLogin.prototype.comparePassword = async function (
    candidatePassword,
    userPassword,
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

  UserLogin.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 12);
  });

  UserLogin.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 12);
    }
  });

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
      createdAt: 'addressCreatedAt',
      updatedAt: 'addressUpdatedAt',
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

  const UserBasket = sequelize.define(
    'UserBasket',
    {},
    {
      freezeTableName: true,
    },
  );

  const UserSession = sequelize.define(
    'UserSession',
    {
      sid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      expires: {
        type: DataTypes.DATE,
      },
      data: {
        type: DataTypes.TEXT,
      },
      UserAccountId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
    },
  );

  return {
    UserAccount,
    UserSession,
    UserLogin,
    UserRole,
    UserAddress,
    UserLike,
    UserBasket,
  };
};

module.exports = defineModels;
