const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.get("/getBalance", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.body.accountNumber });

    if (!user) {
      return res.status(404).send("No User Found");
    }

    res.json({
      name: user.name,
      accountNumber: user.accountNumber,
      balance: user.balance,
    });
  } catch (error) {
    console.log(`Error During GET BALANCE: ${error}`.red);
    res.status(500).send(`Error in GET BALANCE: ${error}`);
  }
});

router.post("/deposit", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send("Invalid Deposit Amount");
    }

    const user = await User.findOne({ accountNumber: req.body.accountNumber });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    user.balance += amount;

    if (!user.transaction) {
      user.transaction = [];
    }

    user.transaction.push({
      type: "Deposit",
      amount,
      date: new Date(),
    });

    await user.save();

    res
      .status(200)
      .json({
        message: "Deposit Successful",
        name: user.name,
        accountNumber: user.accountNumber,
        balance: user.balance,
      });
  } catch (error) {
    console.log(`Error During Deposit: ${error}`.red);
    res.status(500).send(`Error in Deposit: ${error}`);
  }
});

router.post("/withdraw", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send("Invalid Withdraw amount");
    }

    const user = await User.findOne({ accountNumber: req.body.accountNumber });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    user.balance -= amount;

    if (!user.transaction) {
      user.transaction = [];
    }

    user.transaction.push({
      type: "Withdrawal",
      amount,
      date: new Date(),
    });

    await user.save();

    res
      .status(200)
      .json({
        message: "Withdrawl Successful",
        name: user.name,
        accountNumber: user.accountNumber,
        balance: user.balance,
      });
  } catch (error) {
    console.log(`Error During Withdrawl: ${error}`.red);
    res.status(500).send(`Error in Withdrawl: ${error}`);
  }
});

router.get("/transactions", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ accountNumber: req.user.accountNumber });

    if (!user) {
      return res.status(404).send("User Not Found");
    }

    res
      .status(200)
      .json({
        message: "Mini Statement",
        name: user.name,
        accountNumber: user.accountNumber,
        transaction: user.transaction,
      });
  } catch (error) {
    console.log(`Error During Transaction: ${error}`.red);
    res.status(500).send(`Error in Transaction: ${error}`);
  }
});

router.post("/transfer", authenticateToken, async (req, res) => {
  try {
    const sender = await User.findOne({
      accountNumber: req.user.accountNumber,
    });

    if (!sender) {
      return res.status(404).send("Sender Not Found");
    }

    const reciver = await User.findOne({
      accountNumber: req.body.reciverAccountNumber,
    });

    if (!reciver) {
      return res.status(404).send("Reciver Not Found");
    }

    const amount = req.body.amount;

    if (!sender.balance - amount >= 0) {
      return res.status(400).send("Insufficent Balance");
    }

    sender.balance -= amount;
    sender.transaction.push({
      type: "Transfer",
      amount,
      date: new Date(),
    });

    await sender.save();

    reciver.balance += amount;
    reciver.transaction.push({
      type: "Transfer",
      amount,
      date: new Date(),
    });

    await reciver.save();

    res.status(200).json({ message: `Transfer Done Sent ${amount} from ${sender.name} to ${reciver.name}`})
  } catch (error) {
        console.log(`Error During Transfer: ${error}`.red);
        res.status(500).send(`Error in Transfer: ${error}`);
  }
});

router.post("/change-pin", authenticateToken, async (req, res) => {
  try {
    const { pin, newPin } = req.body;

    const theUser = await User.findOne({
      accountNumber: req.user.accountNumber,
    });

    const isValid = await bcrypt.compare(pin, theUser.pin);

    if (isValid) {
      theUser.pin = newPin;
    } else {
      return res.status(400).send("Error in Pin Change");
    }

    await theUser.save();

    res
      .status(200)
      .json({ message: "PIN change successful!", password: theUser.pin });
  } catch (error) {
    console.log(`Error During PIN CHANGE: ${error}`.red);
    res.status(500).send(`Error in PIN CHANGE: ${error}`);
  }
});

module.exports = router;
