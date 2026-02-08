const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validate');

router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);

module.exports = router;
