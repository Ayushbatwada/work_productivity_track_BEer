const express = require("express");
const router = express.Router();
const folderController = require('./controller');

// folder
router.post('/folder/create', folderController.createFolder);
router.get('/folder/get/all', folderController.getAllFolders);
router.get('/folder/task/get/all', folderController.getFolderAssociatedTasks);
router.put('/folder/delete', folderController.changeFolderStatus);
router.put('/folder/task/add', folderController.addTaskInFolder);
router.put('/folder/task/remove', folderController.removeTaskFromFolder);

module.exports = router;
