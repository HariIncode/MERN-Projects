const express = require('express');
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
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
});

router.post('login', async (req, res) => {
    try{
        
    }catch (error){
        console.log(error);
    }
});

module.exports = router;