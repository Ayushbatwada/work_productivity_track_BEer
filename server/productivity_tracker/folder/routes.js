const express = require("express");
const router = express.Router();
const folderController = require('./controller');

// folder
router.post('/create', folderController.createFolder);
router.get('/get/all', folderController.getAllFolders);
router.put('/delete', folderController.changeFolderStatus);
router.get('/folder/task/get/all', folderController.getFolderAssociatedTasks);
router.put('/folder/task/add', folderController.addTaskInFolder);
router.put('/folder/task/remove', folderController.removeTaskFromFolder);

module.exports = router;
