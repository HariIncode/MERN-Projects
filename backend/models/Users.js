const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('ABCDEFGHIJK0123456789', 6);

const userSchema = new mongoose.Schema({
    accountNumber:{ type: String, unique: true },
    name: { type: String, required: true },
    pin: { type: String, required: true },
    balance: { type: Number, default: 1000.0 },
    accountType: { type: String, enum:['Savings', 'Current'], required: true},
    transaction: [{
        type: {
            type: String,
            enum: ['Deposit', 'Withdrawal', 'Transfer'],
            required: true,
        },
        amount: { type: Number, required: true},
        date: { type: Date, default: Date.now },
        default: []
    }]
});

//Use Function() not arrow function [this. will not work]
userSchema.pre('save', async function (next){
    //Create Custom AccountId using nanoid
    if(this.isNew){
        this.accountNumber = nanoid();
    }

    //Hash the PIN if modified or new
    if(this.isModified('pin')){
        if (!/^\d{4}$/.test(this.pin)){
            throw new Error('PIN must be a 4-digit number');
        }
        
        const salt = await bcrypt.genSalt(10);
        //bcrypt works only on Strings
        this.pin = await bcrypt.hash(this.pin.toString(), salt);
    }

    next();
});

//userSchema.methods makes all the user to use this method
//comparePin is a custom method to compare Pin
userSchema.methods.comparePin = async function (enteredPin) {
    return await bcrypt.compare(enteredPin.toString(), this.pin);
};

module.exports = mongoose.model('User', userSchema);