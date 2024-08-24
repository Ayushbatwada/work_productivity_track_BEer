const folderService = require('./service');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    // Folder
    createFolder: (req, res) => {
        let response;
        try {
            folderService.createFolder(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside createFolder controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside createFolder controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside catch block of createFolder controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);

        }
    },

    getAllFolders: (req, res) => {
        let response;
        try {
            folderService.getAllFolders(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside getAllFolders controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidArray(resp.data)) {
                    res.status(resp.code).send(resp);
                } else if (resp.code === 200 && !sanityChecks.isValidArray(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside getAllFolders controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside catch block of getAllFolders controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getFolderAssociatedTasks: (req, res) => {
        let response;
        try {
            folderService.getFolderAssociatedTasks(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside getFolderAssociatedTasks controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidArray(resp.data)) {
                    res.status(resp.code).send(resp);
                } else if (resp.code === 200 && !sanityChecks.isValidArray(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside getFolderAssociatedTasks controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside catch block of getFolderAssociatedTasks controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    changeFolderStatus: (req, res) => {
        let response;
        try {
            folderService.changeFolderStatus(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside changeFolderStatus controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    res.status(resp.code).send(resp);
                } else if (resp.code === 200 && !sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside changeFolderStatus controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside catch block of changeFolderStatus controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    addTaskInFolder: (req, res) => {
        let response;
        try {
            folderService.addTaskInFolder(req, async (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside addTaskInFolder controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    req.body.taskCountFactor = 1;
                    await service.editFolderAsync(req);
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside addTaskInFolder controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside catch block of addTaskInFolder controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    removeTaskFromFolder: (req, res) => {
        let response;
        try {
            folderService.removeTaskFromFolder(req, async (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside removeTaskInFolder controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    req.body.taskCountFactor = -1;
                    await service.editFolderAsync(req);
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && !sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside removeTaskInFolder controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found inside catch block of removeTaskInFolder controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },
}
