const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/signup', authController.isLoggedIn, viewController.signup);
router.get('/login', authController.isLoggedIn, viewController.login);

router.get('/me', authController.protect, viewController.getAccount);
// router.post('/me', authController.protect, viewController.getAccount);

router.get(
  '/products',
  authController.isLoggedIn,
  viewController.getAllProducts,
);
router.get(
  '/products/:id',
  authController.isLoggedIn,
  viewController.getProduct,
);
router.get(
  '/productsCategory/:id',
  authController.isLoggedIn,
  viewController.getProductsCategory,
);
router.get(
  '/productsBrand/:id',
  authController.isLoggedIn,
  viewController.getProductsBrand,
);
router.get(
  '/productsGender/:id',
  authController.isLoggedIn,
  viewController.getProductsGender,
);

module.exports = router;
