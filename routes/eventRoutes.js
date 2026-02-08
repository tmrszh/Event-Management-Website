const express = require('express');
const router = express.Router();
const { getEvents, createEvent, deleteEvent, updateEvent, getEventById } = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.get('/', auth, getEvents);
router.post('/', auth, validate('event'), createEvent);
router.get('/:id', auth, getEventById);
router.put('/:id', auth, validate('event'), updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
