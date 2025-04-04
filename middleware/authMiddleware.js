const jwt = require('jsonwebtoken');
// const User = require('../models/admin/userAdminModel');

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const user = decoded.id
        console.log(user,"kfnvjnfvkjf");

        if (!user) return res.status(401).json({ error: 'User not found' });

        req.user = user; // Attach user data to request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
