const express = require('express');
const appsRoutes = require('./routes/appsRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
const app = express();

app.use(express.json());

app.use('/api/v1', appsRoutes)

app.use('/api/v1', userRoutes)

module.exports = app;