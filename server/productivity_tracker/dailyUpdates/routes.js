const express = require("express");
const router = express.Router();
const dailyUpdatesController = require('./controller');

// updates
router.post('/daily/updates/create', dailyUpdatesController.createDailyUpdate)
router.post('/daily/updates/edit', dailyUpdatesController.editDailyUpdate)
router.get('/daily/updates/get/all', dailyUpdatesController.getAllUpdates)

module.exports = router;
