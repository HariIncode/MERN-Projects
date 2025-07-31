require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./config/db.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors);

app.get('/', (req, res) => {
    res.send("Hello ATM Backend Running !!");
});

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
})