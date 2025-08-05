require('dotenv').config();

const colors = require('colors');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

require('./config/db.js');



app.get('/', (req, res) => {
    res.send("Hello ATM Backend Running !!");
});

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`.green);
})