const express = require('express');
const expressValidator = require('express-validator');
const createUserValidationschema = require('../utils/validationSchema');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/signup',
  expressValidator.checkSchema(createUserValidationschema),
  authController.signup,
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
