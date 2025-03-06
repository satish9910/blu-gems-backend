const UserAdmin = require('../models/admin/userAdminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminRegister = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ error: 'Please provide all the details' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        if (await UserAdmin.findOne({ email })) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await UserAdmin.create({ username, email, password: hashPassword, role });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const adminUser = await UserAdmin.findOne({ email }).select('+password');

        if (!adminUser || !(await bcrypt.compare(password, adminUser.password))) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: adminUser._id, role: adminUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: adminUser._id,
                username: adminUser.username,
                email: adminUser.email,
                role: adminUser.role,
            },
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { adminRegister, adminLogin };
