require('dotenv').config();
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('ABCDEFGHIJK0123456789', 6);
const User = require('./models/Users'); // Ensure correct path

// 🔹 Connect DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1);
  }
};

// 🔹 Sample Users (PIN auto-hashes via hook, accountNumber added manually)
const users = [
  { name: 'John Doe', pin: 1234, accountType: 'Savings', balance: 1500, accountNumber: nanoid() },
  { name: 'Jane Smith', pin: 5678, accountType: 'Current', balance: 2500, accountNumber: nanoid() },
  { name: 'Alex Brown', pin: 9876, accountType: 'Savings', balance: 5000, accountNumber: nanoid() }
];

// 🔹 Seeder Function
const seedUsers = async () => {
  try {
    await connectDB();

    // Clear old data
    await User.deleteMany({});
    console.log('🗑 Old users deleted');

    // Insert users
    for (const user of users) {
      await User.create(user);
    }

    console.log('✅ Sample Users Inserted');
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
  } finally {
    mongoose.connection.close();
    console.log('🔌 DB Connection Closed');
  }
};

// Run Seeder
seedUsers();
