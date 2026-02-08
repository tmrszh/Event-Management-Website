const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const header = req.header('Authorization');

    if (!header) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const token = header.startsWith('Bearer ') ? header.slice(7) : header;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
