const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/signup', authController.isLoggedIn, viewController.signup);
router.get('/login', authController.isLoggedIn, viewController.login);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/myBasket', authController.protect, viewController.myBasket);
router.get(
  '/myFavoriteProduct',
  authController.protect,
  viewController.myFavoriteProduct,
);
router.get('/myOrder', authController.protect, viewController.myOrder);

router.use(authController.isLoggedIn);
router.get('/products', viewController.getAllProducts);
router.get('/products/:id', viewController.getProduct);
router.get('/productsCategory/:id', viewController.getProductsCategory);
router.get('/productsBrand/:id', viewController.getProductsBrand);
router.get('/productsGender/:id', viewController.getProductsGender);

module.exports = router;
