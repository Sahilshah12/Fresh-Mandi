const express = require('express');
const router = express.Router();
const { register, login, profile } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);

module.exports = router;
