const jwt = require('jsonwebtoken');

// Middleware to authenticate
function authenticateToken(req, res, next){
    // auth tokens are in headers for security reasons 
    const authHeader = req.headers['authorization'];

    // If authHeader exist it will give the token 
    // Else it will be undefined 
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        req.user = user;

        next();
    });
};

module.exports = authenticateToken;