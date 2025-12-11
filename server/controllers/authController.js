const knex = require('../config/knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTER
const register = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    try {
        const exists = await knex('users').where({ username }).first();
        console.log('User exists:', exists);
        if (exists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashed = await bcrypt.hash(password, 10);

        await knex('users').insert({ username, password: hashed });

        res.json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Registration error', error: err.message });
    }
};

// LOGIN
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await knex('users').where({ username }).first();
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Login success', token });
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err.message });
    }
};

module.exports = { register, login };