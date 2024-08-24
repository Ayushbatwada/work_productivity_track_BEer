const folderService = require('./service');
const taskService = require('../task/service');
const responseData = require('../../utils/responseData');

module.exports = {
    // Folder
    createFolder: (req, res) => {
        let response;
        try {
            folderService.createFolder(req, (err, createFolderResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "createFolder" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(createFolderResponse.code).send(createFolderResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "createFolder" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);

        }
    },

    getAllFolders: (req, res) => {
        let response;
        try {
            folderService.getAllFolders(req, (err, getAllFoldersResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllFolders" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getAllFoldersResponse.code).send(getAllFoldersResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getAllFolders" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    changeFolderStatus: (req, res) => {
        let response;
        try {
            folderService.changeFolderStatus(req.body, (err, changeFolderStatusResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "changeFolderStatus" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(changeFolderStatusResponse.code).send(changeFolderStatusResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "changeFolderStatus" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getFolderAssociatedTasks: (req, res) => {
        let response;
        try {
            taskService.getFolderAssociatedTasks(req, (err, getFolderAssociatedTasksResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getFolderAssociatedTasks" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getFolderAssociatedTasksResponse.code).send(getFolderAssociatedTasksResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "getFolderAssociatedTasks" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    addTaskInFolder: (req, res) => {
        let response;
        try {
            taskService.addTaskInFolder(req.body, (err, addTaskInFolderResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "addTaskInFolder" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (addTaskInFolderResponse.code === 200 && addTaskInFolderResponse.status === 'success') {

                    // Update tak count in folder model
                    req.body.taskCountFactor = 1;
                    folderService.editFolder(req.body);

                    res.status(addTaskInFolderResponse.code).send(addTaskInFolderResponse);
                } else {
                    res.status(addTaskInFolderResponse.code).send(addTaskInFolderResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "addTaskInFolder" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    removeTaskFromFolder: (req, res) => {
        let response;
        try {
            taskService.removeTaskFromFolder(req.body, (err, removeTaskFromFolderResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "removeTaskFromFolder" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (removeTaskFromFolderResponse.code === 200 && removeTaskFromFolderResponse.status === 'success') {

                    // Update tak count in folder model
                    req.body.taskCountFactor = 1;
                    folderService.editFolder(req.body);

                    res.status(removeTaskFromFolderResponse.code).send(removeTaskFromFolderResponse);
                } else {
                    res.status(removeTaskFromFolderResponse.code).send(removeTaskFromFolderResponse);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside "removeTaskFromFolder" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },
}
