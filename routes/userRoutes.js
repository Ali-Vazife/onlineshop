const express = require('express');
const expressValidator = require('express-validator');
const {
  signupValidationSchema,
  loginValidationSchema,
} = require('../utils/validationSchema');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post(
  '/signup',
  expressValidator.checkSchema(signupValidationSchema),
  authController.signup,
);
router.post(
  '/login',
  expressValidator.checkSchema(loginValidationSchema),
  authController.login,
);

router.use(authController.protect);

router.get('/logout', authController.logout);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
);

router.patch('/updateMyPassword', userController.updatePassword);

module.exports = router;
