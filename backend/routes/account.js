const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/getBalance', authenticateToken, async (req, res) => {
    try{
        const user = await User.findOne({ accountNumber: req.body.accountNumber });

        if(!user){
            return res.status(404).send("No User Found");
        }

        res.json({ name:user.name, accountNumber: user.accountNumber, balance: user.balance});
    }catch(error){
        console.log(`Error During GET BALANCE: ${error}`.red);
        res.status(500).send(`Error in GET BALANCE: ${error}`);
    }
});

router.post('/deposit', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;

        if( !amount || amount <= 0 ){
            return res.status(400).send("Invalid Deposit Amount");
        }

        const user = await User.findOne({ accountNumber: req.body.accountNumber });

        if( !user ){
            return res.status(404).send("User Not Found");
        }

        user.balance += amount;

        if( !user.transaction ){
            user.transaction = [];
        }

        user.transaction.push({
            type: 'Deposit',
            amount,
            date: new Date()
        });

        await user.save();

        res.status(200).json({ message: "Deposit Successful", balance: user.balance });
    } catch (error) {
        console.log(`Error During Deposit: ${error}`.red);
        res.status(500).send(`Error in Deposit: ${error}`);
    }
});

module.exports = router;