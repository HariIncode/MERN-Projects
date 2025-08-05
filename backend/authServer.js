require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');

require('./config/db.js');

const PORT = process.env.AUTH_SERVER_PORT;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);

// Array to Store refresh tokens
let refreshTokens = [];

// To validate the RefreshToken
app.post('/token', (req, res) => {
    // Get the token from body
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    // Validate the refresh token with the secret key
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }

        // If Valid Generate a new AccessKey
        const accessToken = generateAccessToken({ accountNumber: user.accountNumber });

        res.json({ accessToken: accessToken });
    })
})

// API for generating AccessToken and RefreshToken for User
app.post('/login', (req, res) => {
    const user = { accNum: req.body.accountNumber };

    const accessToken = generateAccessToken(user);

    // Generate a RefreshToken and add it to the Array
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

// API to Delete the RefreshToken
app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})


function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });
}


app.listen(PORT, () => {
    console.log(`Server Runnign in: ${PORT}`);
});