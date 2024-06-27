const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const likeController = require('../controllers/likeController');

const router = express.Router();

router.use(authController.protect);
router.post('/like', likeController.like);
router.delete('/unlike', likeController.unlike);

module.exports = router;
