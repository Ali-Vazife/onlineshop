const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);

router.get('/signup', viewController.signup);
router.get('/login', viewController.login);

router.get('/products', viewController.getAllProducts);
router.get('/products/:id', viewController.getProduct);
router.get('/productsCategory/:id', viewController.getProductsCategory);
router.get('/productsBrand/:id', viewController.getProductsBrand);
router.get('/productsGender/:id', viewController.getProductsGender);

module.exports = router;
