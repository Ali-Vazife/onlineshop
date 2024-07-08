const express = require('express');
const basketController = require('../controllers/basketController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.get('/isInTheBasket/:id', basketController.isInTheBasket);
router.post('/addToBasket', basketController.addToBasket);
router.delete('/removeFromBasket', basketController.removeFromBasket);
router.get('/myBasket', authController.protect, basketController.myBasket);
router.get('/myBasketTotalPrice', basketController.myBasketTotalPrice);

module.exports = router;
