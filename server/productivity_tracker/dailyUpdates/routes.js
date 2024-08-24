'use strict'

const express = require("express");
const router = express.Router();
const dailyUpdatesController = require('./controller');

// updates
router.post('/create', dailyUpdatesController.createDailyUpdate)
router.get('/get/all', dailyUpdatesController.getAllUpdates)

module.exports = router;
