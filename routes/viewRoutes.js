const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/:brand?', viewController.getOverview);

module.exports = router;
