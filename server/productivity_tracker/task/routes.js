const express = require('express');
const router = express.Router();
const taskController = require('./controller');

router.post('/task/create', taskController.createTask);
router.get('/task/get/all', taskController.getAllTasks);
router.put('/task/edit', taskController.editTask);
router.put('/task/status/change', taskController.changeTaskStatus);

module.exports = router;
