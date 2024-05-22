const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/products/:id', viewController.getProduct);
// In your routes file (e.g., productRoutes.js or app.js)
router.get('/products/:id/size', viewController.getSizes);
router.get('/products/:id/price', viewController.getProductPrice);


// router.get('/products/:id/size', viewController.getSizesForColor);
// router.get('/products/:id/color', viewController.getPriceForColorAndSize);
router.get('/productsCategory/:id', viewController.getProductsCategory);
router.get('/productsBrand/:id', viewController.getProductsBrand);
router.get('/productsGender/:id', viewController.getProductsGender);

module.exports = router;




