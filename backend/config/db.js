require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log("DB Connected!"))
    .catch((error) => console.error(`Error While Connecting to DB: ${error}`));
