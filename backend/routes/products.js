const express = require('express');
const router = express.Router();
const { browseByCity, getProductDetails } = require('../controllers/productController');

// Public browse
router.get('/', browseByCity);
router.get('/:id', getProductDetails);

module.exports = router;
