const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth middleware - Token received:', !!token);
    console.log('Auth middleware - JWT_SECRET present:', !!JWT_SECRET);
    
    if (!token) {
        console.log('Auth middleware - No token provided');
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Auth middleware - Token verified successfully');
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Auth middleware - Token verification failed:', error.message);
        res.status(401).json({ error: 'Invalid token.' });
    }
};

module.exports = { auth, JWT_SECRET };