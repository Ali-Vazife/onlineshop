const { matchedData, validationResult } = require('express-validator');

const {
  UserAccount,
  UserLogin,
  UserRole,
  UserBasket,
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

  if (checkEmail) {
    return next(new AppError('This email already registered', 400));
  }

  const newUserAcc = await UserAccount.create({
    firstName,
    lastName,
  });

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

    res.cookie('sid', 'loggedout', {
      expires: new Date(Date.now() + 3 * 1000),
      httpOnly: true,
    });

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

  const basketCount = await UserBasket.count({
    where: { UserAccountId: currentUser.id },
  });

  req.user = currentUser;
  res.locals.basket = basketCount;
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

      const basketCount = await UserBasket.count({
        where: { UserAccountId: currentUser.id },
      });

      // Check if user changed password after the token was issue
      // if (currentUser.changedPasswordAfter(decoded.iat)) {
      //   return next();
      // }

      res.locals.user = currentUser;
      res.locals.basket = basketCount;
      return next();
    } catch (err) {
      console.error('Logged user error 😤', err);
      return next();
    }
  }
  next();
};

module.exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return next(
      new AppError('Password confirmation does not match password', 401),
    );
  }
  const userId = req.user.id;

  if (!userId) {
    return next(new AppError('Something went wrong! Try again later.', 500));
  }

  const user = await UserLogin.findOne({
    where: { UserAccountId: userId },
  });

  if (!user || !(await user.comparePassword(passwordCurrent, user.password))) {
    return next(
      new AppError('Incorrect password or user does not exist!', 401),
    );
  }

  user.password = password;
  await user.save();

  const sessionData = req.session;
  req.session.regenerate((err) => {
    Object.assign(req.session, sessionData);
    if (err) {
      return next(new AppError('Failed to regenerate session.', 500));
    }
  });

  res.status(200).json({ status: 'success' });
});
