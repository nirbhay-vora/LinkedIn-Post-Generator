const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, auth } = require('../../middleware/auth');

const router = express.Router();

// Hardcoded admin credentials (change these!)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Login endpoint
router.post('/login', (req, res) => {
    console.log('Login attempt:', req.body);
    console.log('Expected username:', ADMIN_USERNAME);
    console.log('Expected password:', ADMIN_PASSWORD);
    
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log('Login successful, sending token');
        res.json({ token, message: 'Login successful' });
    } else {
        console.log('Login failed - invalid credentials');
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Verify token endpoint
router.get('/verify', auth, (req, res) => {
    res.json({ valid: true, user: req.user });
});

module.exports = router;