const express = require('express');
const { getLibrary, deleteApp } = require('../controller/libraryController');
const { isAuthenticated } = require("../middlewares/authMiddleware")

const router = express.Router();

router.get('/library/:id', isAuthenticated, getLibrary);

router.delete('/library/delete/:packageName', isAuthenticated, deleteApp);

module.exports = router;
