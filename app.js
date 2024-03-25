const express = require('express');
const appsRoutes = require('./routes/appsRoutes');
const userRoutes = require('./routes/userRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const cors = require("cors");

require('dotenv').config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', appsRoutes)

app.use('/api/v1', userRoutes)

app.use('/api/v1', libraryRoutes);

module.exports = app;