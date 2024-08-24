const folderModel = require('./model');
const taskModel = require('./../task/model');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');
const folderConfig = require('./config.json');
const {isValidArray} = require("../../utils/sanityChecks");

module.exports = {
    // Folder
    createFolder: (req, callback) => {
        let response;
        const body = req.body;
        const folderName = body.folderName;
        const folderDescription = body.folderDescription;
        const folderCategory = body.folderCategory;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(folderName) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) ||
                !folderCategory  || !folderConfig.folderCategories.values.includes(folderCategory)) {
            console.log('ERROR ::: Missing info in "createFolder" service with info, folderName: ' + folderName +
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
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "createFolder" service db error catch block with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            });
        } catch (err) {
            console.log('ERROR ::: found in "createFolder" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    editFolder(body, callback) {
        let response;
        const folderId = body.folderId;
        const createdBy = body.createdBy;
        const taskCountFactor = body.taskCountFactor || 0;

        if (!sanityChecks.isValidMongooseId(folderId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId)) {
            console.log('ERROR ::: Missing info in "editFolder" service with info, folderId: ' + folderId +
                '. createdBy: ' + JSON.stringify(createdBy));
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: folderId,
                status: folderId.status.active
            };
            const updateQuery = {
                $inc: {taskCount: taskCountFactor}
            };
            folderModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "editFolder" service error block with err: ' + err);
                    response = new responseData.serverError();
                    return callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp)) {
                    response = new responseData.successMessage();
                    response.data = dbResp;
                    return callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in "editFolder" service catch block with err: ' + err);
            response = new responseData.serverError();
            return callback(null, response)
        }
    },

    getAllFolders: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        if (!sanityChecks.isValidMongooseId(userId)) {
            console.log('ERROR ::: Missing info in :getAllFolders: service with info, userId: ' + userId);
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
                status: folderConfig.status.active,
                "createdBy.userId": userId
            };
            folderModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllFolders" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp};
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in "getAllFolders" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    changeFolderStatus: (body, callback) => {
        let response;
        const folderId = body.folderId;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidMongooseId(folderId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId)) {
            console.log('ERROR ::: Missing info in "changeFolderStatus" service with info, err: ' + folderId +
                '. createdBy: ' + JSON.stringify(createdBy));
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: folderId,
                status: folderConfig.status.active
            }
            const updateQuery = {
                status: folderConfig.status.inactive
            }
            folderModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getFolderAssociatedTasks" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidObject(dbResp)) {
                    response = new responseData.successMessage();
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    callback(null, response);
                }
            })
        } catch (err) {
            console.log('ERROR ::: found in "changeFolderStatus" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    }
}
