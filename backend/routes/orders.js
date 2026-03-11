const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { placeOrder, getOrdersForUser, updateOrderStatus, updatePaymentStatus } = require('../controllers/orderController');

router.use(auth);

router.post('/', placeOrder);
router.get('/my-orders', getOrdersForUser);
router.get('/farmer-orders', getOrdersForUser);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/payment', updatePaymentStatus);

module.exports = router;
