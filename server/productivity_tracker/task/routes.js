const express = require('express');
const router = express.Router();
const taskController = require('./controller');
const folderController = require("../folder/controller");

router.post('/create', taskController.createTask);
router.get('/get/all', taskController.getAllTasks);
router.put('/status/change', taskController.changeTaskStatus);

module.exports = router;
