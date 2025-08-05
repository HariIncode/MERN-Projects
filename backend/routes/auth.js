const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Users.js');

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
            return res.status(404).json({ message: "User Not Found! "});
        }

        const isValidPassword = bcrypt.compare(pin.toString(), user.pin);

        if(!isValidPassword){
            return res.status(401).json({ message: "Password Dosen't Match" });
        }

        res.status(202).json({ message: "Login Successful!" });
    } catch (error) {
        console.log(`Error During Login: ${error}`);
        res.status(500).json({ message: `Error During Login: ${error}`});
    }

});

router.post('login', async (req, res) => {
    try{
        
    }catch (error){
        console.log(error);
    }
});


// Filters the data and sends only the users data
// app.get('/posts', authenticateToken, (req, res) => {
//     res.send(posts.filter(post => post.username === req.user.name));
// });

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
}

module.exports = router;