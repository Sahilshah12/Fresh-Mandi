
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const upload = require('../middleware/upload');
const { addProduct, getFarmerProducts, updateProduct, deleteProduct } = require('../controllers/productController');

router.use(auth);
router.use(roles('farmer'));

// Accept multipart/form-data with field name 'image'
router.post('/products', upload.single('image'), addProduct);
router.get('/products', getFarmerProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
