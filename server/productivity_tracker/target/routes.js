'use strict'

const express = require("express");
const router = express.Router();
const targetController = require("./controller");

router.post('/create', targetController.createTarget);
router.get('/get/all', targetController.getAllTargets);
router.put('/status/change', targetController.changeTargetStatus);

module.exports = router;
