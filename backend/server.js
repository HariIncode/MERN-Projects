require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

require('./config/db.js');

const authRoutes = require('./routes/auth.js');

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("Hello ATM Backend Running !!");
});

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT}`);
})