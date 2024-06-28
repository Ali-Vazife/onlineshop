const express = require('express');
const basketController = require('../controllers/basketController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.post('/addtoBasket', basketController.addToBasket);
router.delete('/removeFromBasket', basketController.removeFromBasket);

module.exports = router;
