const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/getBalance',authenticateToken, async (req, res) => {
    try{
        const user = await User.findOne({ accountNumber: req.body.accountNumber });

        if(!user){
            return res.status(404).send("No User Found");
        }

        res.json({ balance: user.balance});
    }catch(error){
        res.status(500).send(`Error in GET BALANCE: ${error}`);
    }
});

module.exports = router;