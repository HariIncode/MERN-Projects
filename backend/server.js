require('dotenv').config();

const colors = require('colors');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(bodyParser.json());
app.use(cors());

require('./config/db.js');

const account = require('./routes/account.js');
app.use('/api/account', account);

app.get('/', (req, res) => {
    res.send("Hello ATM Backend Running !!");
});

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`.green);
})