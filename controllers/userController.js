const User = require('../models/User');

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
