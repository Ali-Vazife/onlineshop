const { where, Op, Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { sequelize,
  UserAccount,
  UserLogin,
  UserRole,
} = require('../sequelize/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  // create a new user
  const newUser = await UserAccount.create({
    firstName: 'Jane',
    lastName: 'Doe',
  });
  console.log("Jane's auto-generated ID:", newUser.id);

  res.status(200).json({ newUser });
});
