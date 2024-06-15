const { matchedData, validationResult } = require('express-validator');

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
  const errResult = validationResult(req);
  if (!errResult.isEmpty()) {
    const errorMessages = errResult
      .array()
      .map((errms) => errms.msg)
      .join(', ');
    return next(new AppError(`Validation error: ${errorMessages}`, 400));
  }
  const { firstName, lastName, emailAddress, password } = matchedData(req);

  const checkEmail = await UserLogin.findOne({
    where: { emailAddress },
  });
  // console.log('checkEmail', checkEmail);

  if (checkEmail) {
    return next(new AppError('This email already registered', 400));
  }

  const newUserAcc = await UserAccount.create({
    firstName,
    lastName,
  });
  // console.log('newUserAcc', newUserAcc);

  await UserLogin.create({
    emailAddress: emailAddress,
    password: password,
    UserAccountId: newUserAcc.id,
  });
  // console.log('newUserLog', newUserLog);

  req.session.userId = newUserAcc.id;

  res.status(201).json({ status: 'success' });
});

exports.login = catchAsync(async (req, res, next) => {
  const { emailAddress, password } = req.body;
  if (!emailAddress || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await UserLogin.findOne({ where: { emailAddress } });

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  req.session.userId = user.id;

  res.status(201).json({ status: 'success' });
});

exports.logout = catchAsync(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(new AppError('There is a problem for logout', 400));
    }
    res.clearCookie('sid');
    res.redirect('/');
    res.status(200).json({ status: 'success' });
  });
});
