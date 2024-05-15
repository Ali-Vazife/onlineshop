const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getOverview);
router.get('/productsCategory/:id', viewController.getProductsCategory);
router.get('/productsBrand/:id', viewController.getProductsBrand);

module.exports = router;
