const { matchedData, validationResult } = require('express-validator');

const { UserAccount, UserLogin, UserRole } = require('../sequelize/db');
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
  const errResult = validationResult(req);
  if (!errResult.isEmpty()) {
    const errorMessages = errResult
      .array()
      .map((errms) => errms.msg)
      .join(', ');
    return next(new AppError(`Validation error: ${errorMessages}`, 400));
  }
  const { emailAddress, password } = matchedData(req);

  if (!emailAddress || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await UserLogin.findOne({ where: { emailAddress } });

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  req.session.userId = user.UserAccountId;

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

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.session.userId) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  const currentUser = await UserAccount.findByPk(req.session.userId, {
    include: {
      model: UserRole,
      attributes: ['role'],
    },
    attributes: {
      exclude: ['UserAccountCreatedAt', 'UserAccountUpdatedAt'],
    },
  });
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this session no longer exists.', 401),
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) =>
  (req, res, next) => {
    const userRole = req.user.UserRole.role;
    if (!roles.includes(userRole)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

// For rendered page
exports.isLoggedIn = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const { userId } = req.session;
      const currentUser = await UserAccount.findByPk(userId);
      if (!currentUser) {
        return next();
      }

      // Check if user changed password after the token was issued
      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next();
      // }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
