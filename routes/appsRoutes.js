const express = require('express');
const { getAllApps, postApp } = require('../controller/appsController');
const uploadMiddleware = require('../middlewares/uploadAppMiddleware');

const router = express.Router();

router.get('/apps', getAllApps);

router.post('/apps', uploadMiddleware, postApp);

module.exports = router;
