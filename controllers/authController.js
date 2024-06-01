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
  const { firstName, lastName, emailAddress, password, passwordConfirm } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !emailAddress ||
    !password ||
    !passwordConfirm
  ) {
    return next(new AppError('All fields must be completed!', 400));
  }

  if (password !== passwordConfirm) {
    return next(
      new AppError('Password and password confrim are not equal', 400),
    );
  }

  const checkEmail = await UserLogin.findOne({
    where: { emailAddress },
  });
  console.log('checkEmail', checkEmail);

  if (checkEmail) {
    return next(new AppError('This email already registered', 400));
  }

  const newUserAcc = await UserAccount.create({
    firstName,
    lastName,
  });
  console.log('newUserAcc', newUserAcc.id);

  const newUserLog = await UserLogin.create({
    emailAddress: emailAddress,
    password: password,
    UserAccountId: newUserAcc.id,
  });
  console.log('newUserLog', newUserLog);

  res.status(200).json({ newUserAcc, newUserLog });
});
