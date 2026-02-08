const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate('updateProfile'), updateProfile);

module.exports = router;
