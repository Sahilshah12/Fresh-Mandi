const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { 
  listUsers, 
  approveOrBlock, 
  approveFarmer,
  deleteUser,
  listAllProducts,
  deleteProduct,
  listAllOrders,
  analytics 
} = require('../controllers/adminController');

router.use(auth);
router.use(roles('admin'));

router.get('/users', listUsers);
router.put('/user/:id/approve', approveOrBlock);
router.put('/users/:id/approve', approveFarmer);
router.delete('/users/:id', deleteUser);

router.get('/products', listAllProducts);
router.delete('/products/:id', deleteProduct);

router.get('/orders', listAllOrders);

router.get('/analytics', analytics);

module.exports = router;
