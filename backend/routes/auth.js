const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Users.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try{
        const { name, pin, accountType, balance } = req.body;

        if( !name || !pin || !accountType ){
            return res.status(400).json({message: 'Name, PIN and AccountType are required!'});
        }

        const newUser = new User({
            name,
            pin,
            accountType,
            balance: balance || undefined
        });

        await newUser.save();

        res.status(201).json({
            message: " Account created successfully",
            accountNumber: newUser.accountNumber,
            balance: newUser.balance,
            accountType: newUser.accountType
        })
    }catch (error){
        console.error(error.red);
        res.status(500).json({ message: 'Server Error'});
    }
});

router.post('/login', async (req, res) => {
    const accountNumber = req.body.accountNumber;
    const pin = req.body.pin;

    try {
        const user = await User.findOne({ accountNumber });
        
        if (!user){
            return res.status(404).json({ message: "User Not Found!" });
        }

        const isValidPassword = await bcrypt.compare(pin, user.pin);

        if(!isValidPassword){
            return res.status(401).json({ message: "Password Dosen't Match" });
        }

        const accessToken = generateAccessToken(user);

        // Generate a RefreshToken and add it to the Array
        const refreshToken = jwt.sign({ accountNumber: user.accountNumber }, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken);

        res.status(202).json({ message: "Login Successful!", accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        console.log(`Error During Login: ${error}`.red);
        res.status(500).json({ message: `Error During Login: ${error}`});
    }

});

// Array to Store refresh tokens
let refreshTokens = [];

// To validate the RefreshToken
router.post('/token', (req, res) => {
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
});

// API to Delete the RefreshToken
router.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

function generateAccessToken(user){
    return jwt.sign({ accountNumber: user.accountNumber }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '50s' });
}

module.exports = router;