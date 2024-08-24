const taskModel = require('./model');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');
const taskConfig = require('./config.json');

module.exports = {
    createTask: (body, callback) => {
        let response;
        const taskName = body.taskName;
        const taskDescription = body.taskDescription;
        const taskType = body.taskType;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(taskName) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) ||
            !sanityChecks.isValidString(taskType) || !taskConfig.taskTypes.values.includes(taskType)) {
            console.log('ERROR ::: Missing info in "createTask" service with info, taskName: ' + taskName +
                '. createdBy: ' + JSON.stringify(createdBy) + '. taskType: ' + taskType);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const task = new taskModel();
            task.name = taskName;
            task.description = taskDescription;
            task.type = taskType;
            task.createdBy = createdBy;
            task.updateddBy = createdBy;

            task.save().then((dbResp) => {
                response = new responseData.successMessage();
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "createTask" service db error catch block with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            })
        } catch(err) {
            console.log('ERROR ::: found in "createTask" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getAllTasks: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const status = req.query.st;

        if (!sanityChecks.isValidMongooseId(userId)) {
            console.log('ERROR ::: Missing info in "getAllTasks" service with info, userId: ' + userId);
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
                "createdBy.userId" : userId
            }
            if (taskConfig.status.values.includes(status)){
                filterQuery.status = status;
            } else {
                filterQuery.status = taskConfig.status.active;
            }
            taskModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllTasks" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp};
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            })
        } catch(err) {
            console.log('ERROR ::: found in "getAllTasks" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    changeTaskStatus: (body, callback) => {
        let response;
        const taskId = body.taskId;
        const createdBy = body.createdBy;
        const status = body.status

        if (!sanityChecks.isValidMongooseId(taskId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) ||
            !taskConfig.status.values.includes(status)) {
            console.log('ERROR ::: Missing info in "changeTaskStatus" service with info, taskId: ' + taskId +
                '. createdBy: ' + createdBy + '. status' + status);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: taskId,
                status: { $ne: status }
            };
            const updateQuery = {
                status: status
            };
            taskModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "changeTaskStatus" service with err: ' + err);
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
        } catch(err) {
            console.log('ERROR ::: found in "changeTaskStatus" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getFolderAssociatedTasks: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const folderId = req.query.fid;
        const status = req.query.st;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        if (!sanityChecks.isValidMongooseId(userId) || !sanityChecks.isValidMongooseId(folderId)) {
            console.log('ERROR ::: Missing info in "getFolderAssociatedTasks" service with info, userId: ' + userId
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
                status: taskConfig.status.active,
                "createdBy.userId": userId,
            }
            if (taskConfig.status.values.includes(status)) {
                filterQuery.status = status
            }
            taskModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getFolderAssociatedTasks" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp};
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    return callback(null, response);
                }
            });
        } catch (err) {
            console.log('ERROR ::: found in "getFolderAssociatedTasks" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    addTaskInFolder: (body, callback) => {
        let response;
        const folderId = body.folderId;
        const taskId = body.taskId;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidMongooseId(folderId) || !sanityChecks.isValidMongooseId(taskId) || !createdBy ||
            !sanityChecks.isValidMongooseId(createdBy.userId)) {
            console.log('ERROR ::: Missing info in "addTaskInFolder" service with info, err: ' + folderId +
                '. createdBy: ' + JSON.stringify(createdBy) + '. taskId: ' + taskId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: taskId,
                folderId: {$eq: null}
            };
            const updateQuery = {
                folderId: folderId
            };
            taskModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "addTaskInFolder" service error block with err: ' + err);
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
            console.log('ERROR ::: found in "addTaskInFolder" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    removeTaskFromFolder: (body, callback) => {
        let response;
        const folderId = body.folderId;
        const taskId = body.taskId;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidMongooseId(folderId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId)) {
            console.log('ERROR ::: Missing info in "removeTaskFromFolder" service with info, err: ' + folderId +
                '. createdBy: ' + createdBy + '. taskId: ' + taskId);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: taskId,
                folderId: folderId
            };
            const updateQuery = {
                folderId: null
            };
            taskModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "removeTaskFromFolder" service error block with err: ' + err);
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
            console.log('ERROR ::: found in "removeTaskFromFolder" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    }
}
