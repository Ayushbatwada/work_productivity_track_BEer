const express = require("express");
const router = express.Router();
const targetController = require("./controller");

router.post('/target/create', targetController.createTarget);
router.get('/target/get/all', targetController.getAllTargets);
router.put('/target/edit', targetController.editTarget);
router.put('/status/change', targetController.changeTargetStatus);

module.exports = router;
