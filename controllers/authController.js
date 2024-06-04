const jwt = require('jsonwebtoken');
const { where, Op, Sequelize } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { sequelize,
  UserAccount,
  UserLogin,
  UserRole,
} = require('../sequelize/db');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user.id);

  // res.cookie('jwt', token, {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   ),
  //   httpOnly: true,
  //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  // });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  // user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

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
  // console.log('checkEmail', checkEmail);

  if (checkEmail) {
    return next(new AppError('This email already registered', 400));
  }

  const newUserAcc = await UserAccount.create({
    firstName,
    lastName,
  });
  console.log('newUserAcc', newUserAcc);

  const newUserLog = await UserLogin.create({
    emailAddress: emailAddress,
    password: password,
    UserAccountId: newUserAcc.id,
  });
  console.log('newUserLog', newUserLog);

  createSendToken(newUserAcc, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { emailAddress, password } = req.body;
  if (!emailAddress || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await UserLogin.findOne({ where: { emailAddress } });
  console.log('user', user);

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});
