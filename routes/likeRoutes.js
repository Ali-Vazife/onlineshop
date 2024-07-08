const express = require('express');

const authController = require('../controllers/authController');
const likeController = require('../controllers/likeController');

const router = express.Router();

router.use(authController.protect);
router.post('/like', likeController.like);
router.delete('/unlike', likeController.unlike);
router.get('/myFavoriteProduct', likeController.myFavoriteProduct);

module.exports = router;
