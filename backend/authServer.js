require('dotenv').config();
require('colors');

const express = require('express');
const app = express();
const cors = require('cors');

require('./config/db.js');

const PORT = process.env.AUTH_SERVER_PORT;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.js');
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server Runnign in: ${PORT}`.green);
});