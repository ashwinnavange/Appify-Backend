const express = require('express');
const { getAllApps, postApp, getApp, getAllGames } = require('../controller/appsController');
const uploadMiddleware = require('../middlewares/uploadAppMiddleware');

const router = express.Router();

router.get('/apps', getAllApps);

router.get('/games', getAllGames);

router.get('/apps/:packageName', getApp);

router.post('/apps', uploadMiddleware, postApp);

module.exports = router;
