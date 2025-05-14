const jwt = require('jsonwebtoken'); 

exports.authenticate = (req, res, next) => {
    
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    try {
        const decoded = jwt.verify(token, 'i3hduejm38');
        req.userId = decoded.userId; 
        next();
    } catch (error) {
        res.status(403).json({ error: "Неверный токен" });
    }
};