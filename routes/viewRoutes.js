const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/products', viewController.getAllProducts);
router.get('/products/:id', viewController.getProduct);

router.get('/products/:id/size', viewController.getSizes);
router.get('/products/:id/price', viewController.getProductPrice);

router.get('/productsSelectedBrand', viewController.getSelectedProductsBrand);
router.get('/productsSelectedAllBrands', viewController.getProductsAllBrands);

router.get('/productsCategory/:id', viewController.getProductsCategory);
router.get('/productsBrand/:id', viewController.getProductsBrand);
router.get('/productsGender/:id', viewController.getProductsGender);

module.exports = router;
