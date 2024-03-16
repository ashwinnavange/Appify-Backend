const express = require("express");
const {
  getAllApps,
  postApp,
} = require("../controller/appsController");

const router = express.Router();

router.get("/apps", getAllApps);

router.post("/apps", postApp);

module.exports = router;