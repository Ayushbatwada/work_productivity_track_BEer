const folderModel = require('./model');
const taskModel = require('./../task/model');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    // Folder
    createFolder: (req, callback) => {
        let response;
        const body = req.body;
        const folderName = body.folderName;
        const folderDescription = body.folderDescription;
        const folderCategory = body.folderCategory;
        const createdBy = body.createdBy;

        if (!folderName || !folderCategory || !createdBy || (createdBy && !createdBy.userId)) {
            console.log('ERROR ::: Missing info in createFolder service with info, folderName: ' + folderName +
                '. createdBy: ' + JSON.stringify(createdBy) + '. folderCategory: ' + folderCategory);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const folder = new folderModel();
            folder.name = folderName;
            folder.description = folderDescription;
            folder.category = folderCategory;
            folder.createdBy = createdBy;
            folder.updateddBy = createdBy;

            folder.save().then((dbResp) => {
                response = new responseData.successMessage();
                response.data = dbResp;
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in db error catch block of createFolder service with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            })
        } catch (err) {
            console.log('ERROR ::: found in catch block of createFolder service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    editFolderAsync(req) {
        return new Promise((resolve) => {
            let response;
            const body = req.body;
            const folderId = body.folderId;
            const createdBy = body.createdBy;
            const taskCountFactor = body.taskCountFactor || 0;
            console.log(taskCountFactor);

            if (!folderId || !createdBy || (createdBy && !createdBy.userId)) {
                console.log('ERROR ::: Missing info in editFolderAsync service with info, folderId: ' + folderId +
                    '. createdBy: ' + createdBy);
                response = new responseData.payloadError();
                return resolve(response);
            }

            try {
                const filterQuery = {
                    _id: folderId,
                    status: 'active'
                }
                const updateQuery = {
                    $inc: {taskCount: taskCountFactor}
                }
                folderModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                    if (err) {
                        console.log('ERROR ::: found in editFolderAsync service with err: ' + err);
                        response = new responseData.serverError();
                        return resolve(response)
                    } else if (dbResp && dbResp._id) {
                        response = new responseData.successMessage();
                        response.data = dbResp;
                        return resolve(response)
                    } else {
                        response = new responseData.notFoundError();
                        return resolve(response)
                    }
                })
            } catch (err) {
                console.log('ERROR ::: found in catch block of editFolderAsync service with err: ' + err);
                response = new responseData.serverError();
                return resolve(response)
            }
        })
    },

    getAllFolders: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        if (!sanityChecks.isValidString(userId)) {
            console.log('ERROR ::: Missing info in getAllFolders service with info, userId: ' + userId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const options = {
                page: page,
                limit: limit,
                customLabels: responseData.customLabels
            };
            const filterQuery = {
                status: 'active',
                "createdBy.userId": userId
            }
            folderModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in getAllFolders service with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else {
                    response = new responseData.successMessage();
                    response.data = dbResp.data;
                    response.total = dbResp.total;
                    response.pages = dbResp.pages;
                    response.page = dbResp.page;
                    response.limit = dbResp.limit;
                    callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in catch block of getAllFolders service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getFolderAssociatedTasks: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const folderId = req.query.fid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const filter = req.query.filter || '';

        if (!sanityChecks.isValidString(userId) || !sanityChecks.isValidString(folderId)) {
            console.log('ERROR ::: Missing info in getFolderAssociatedTasks service with info, userId: ' + userId
                + '. folderId: ' + folderId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const options = {
                page: page,
                limit: limit,
                customLabels: responseData.customLabels
            };
            const filterQuery = {
                folderId: folderId,
                "createdBy.userId": userId,
            }
            if (sanityChecks.isValidString(filter)) {
                filterQuery.status = filter
            }
            taskModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in getFolderAssociatedTasks service with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else {
                    response = new responseData.successMessage();
                    response.data = dbResp.data;
                    response.total = dbResp.total;
                    response.pages = dbResp.pages;
                    response.page = dbResp.page;
                    response.limit = dbResp.limit;
                    callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in catch block of getFolderAssociatedTasks service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    changeFolderStatus: (req, callback) => {
        let response;
        const body = req.body;
        const folderId = body.folderId;
        const createdBy = body.createdBy;

        if (!folderId || !createdBy || (createdBy && !createdBy.userId)) {
            console.log('ERROR ::: Missing info in changeFolderStatus service with info, err: ' + folderId +
                '. createdBy: ' + createdBy);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: folderId,
                taskCount: 0,
                status: 'active'
            }
            const updateQuery = {
                status: 'inactive',
            }
            folderModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in getFolderAssociatedTasks service with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (dbResp && dbResp._id) {
                    response = new responseData.successMessage();
                    response.data = dbResp;
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in catch block of changeFolderStatus service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    addTaskInFolder: (req, callback) => {
        let response;
        const body = req.body;
        const folderId = body.folderId;
        const taskId = body.taskId;
        const createdBy = body.createdBy;

        if (!folderId || !taskId || !createdBy || (createdBy && !createdBy.userId)) {
            console.log('ERROR ::: Missing info in addTaskInFolder service with info, err: ' + folderId +
                '. createdBy: ' + createdBy + '. taskId: ' + taskId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: taskId,
                folderId: {$eq: null},
                status: {$ne: 'inactive'}
            }
            const updateQuery = {
                folderId: folderId
            }
            taskModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in addTaskInFolder service with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (dbResp && dbResp._id) {
                    response = new responseData.successMessage();
                    response.data = dbResp;
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in catch block of addTaskInFolder service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    removeTaskFromFolder: (req, callback) => {
        let response;
        const body = req.body;
        const folderId = body.folderId;
        const taskId = body.taskId;
        const createdBy = body.createdBy;

        if (!folderId || !createdBy || (createdBy && !createdBy.userId)) {
            console.log('ERROR ::: Missing info in removeTaskFromFolder service with info, err: ' + folderId +
                '. createdBy: ' + createdBy + '. taskId: ' + taskId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: taskId,
                folderId: folderId,
                status: {$ne: 'inactive'}
            }
            const updateQuery = {
                folderId: null
            }
            taskModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in removeTaskFromFolder service with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (dbResp && dbResp._id) {
                    response = new responseData.successMessage();
                    response.data = dbResp;
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in catch block of removeTaskFromFolder service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },
}
