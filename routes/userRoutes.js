const express = require('express');
const expressValidator = require('express-validator');
const {
  signupValidationSchema,
  loginValidationSchema,
} = require('../utils/validationSchema');
const authController = require('../controllers/authController');

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

router.get('/logout', authController.logout);

module.exports = router;
