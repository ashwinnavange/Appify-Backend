const express = require('express');
const appsRoutes = require('./routes/appsRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', appsRoutes)

app.use('/api/v1', userRoutes)

module.exports = app;