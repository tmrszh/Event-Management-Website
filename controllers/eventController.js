const Event = require('../models/Event');

// Get all events for logged-in user
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Create event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        if (!title || !date) {
            return res.status(400).json({ message: 'Title and date are required' });
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            user: req.user.id
        });

        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, date, location } },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};
