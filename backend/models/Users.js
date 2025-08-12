const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("ABCDEFGHIJK0123456789", 6);

// Define transaction schema FIRST
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Deposit", "Withdrawal", "Transfer Out", "Transfer In"],
    required: true,
  },
  amount: { type: Number, required: true, min: 1 },
  date: { type: Date, default: Date.now },
  from: {
    type: String,
    required: function () {
      return this.type === "Transfer Out" || this.type === "Withdrawal";
    },
  },
  to: {
    type: String,
    required: function () {
      return this.type === "Transfer In" || this.type === "Deposit";
    },
  },
});

// Now define user schema
const userSchema = new mongoose.Schema({
  accountNumber: { type: String, unique: true },
  name: { type: String, required: true },
  pin: { type: String, required: true },
  balance: { type: Number, default: 1000.0, min: 0 },
  accountType: {
    type: String,
    enum: ["Savings", "Premium", "Business"],
    default: "Savings",
    required: true,
  },
  transaction: {
    type: [transactionSchema],
    default: [],
  },
  dailyWithdrawn: { type: Number, default: 0 },
  lastTransactionDate: { type: Date },
});

// Pre-save hook
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.accountNumber = nanoid();
  }

  if (this.isModified("pin")) {
    if (!/^\d{4}$/.test(this.pin)) {
      throw new Error("PIN must be a 4-digit number");
    }
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin.toString(), salt);
  }

  next();
});

// Method to compare pin
userSchema.methods.comparePin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin.toString(), this.pin);
};

module.exports = mongoose.model("User", userSchema);
