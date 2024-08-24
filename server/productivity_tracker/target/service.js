'use strict'

const targetModel = require('./model');
const targetConfig = require('./config.json');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    createTarget: (body, callback) => {
        let response;
        const targetDescription = body.targetDescription;
        const associatedTaskIds = body.associatedTaskIds;
        const startDate = body.startDate;
        const dueDate = body.dueDate;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(targetDescription) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) ||
            !sanityChecks.isValidArray(associatedTaskIds) || !sanityChecks.isValidDate(startDate) || !sanityChecks.isValidDate(dueDate)) {
            console.log('ERROR ::: Missing info in createTarget service with info, targetDescription: ' + targetDescription +
                '. createdBy: ' + createdBy + '. associatedTaskIds: ' + associatedTaskIds + '. startDate: ' + startDate +
                '. dueDate: ' + dueDate);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const target = new targetModel({
                description: targetDescription,
                associatedTaskIds: associatedTaskIds,
                startDate: startDate,
                dueDate: dueDate,
                createdBy: createdBy,
                updatedBy: createdBy
            });

            target.save().then((dbResp) => {
                response = new responseData.successMessage();
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "createTarget" service  db error block with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            })
        } catch(err) {
            console.log('ERROR ::: found in "createTarget" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getAllTargets: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const filter = req.query.filter || '';
        const status = req.query.st;
        const startDate = req.query.sd;
        const dueDate = req.query.ed;

        if (!sanityChecks.isValidMongooseId(userId)) {
            console.log('ERROR ::: Missing info in "getAllTargets" service with info, userId: ' + userId);
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
                status: targetConfig.status.assigned,
                "createdBy.userId" : userId
            }
            if (targetConfig.status.values.includes(status)) {
                filterQuery.status = status;
            }
            if (filter === 'dateRange' && sanityChecks.isValidDate(startDate) && sanityChecks.isValidDate(dueDate)) {
                filterQuery['$and'] = [
                    { startDate : { $gte : new Date(startDate) } },
                    { endDate: { $lte : new Date(dueDate) } }
                ];
            }

            targetModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllTargets" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp};
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    callback(null, response);
                }
            })
        } catch(err) {
            console.log('ERROR ::: found in "getAllTargets" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    changeTargetStatus: (body, callback) => {
        let response;
        const targetId = body.targetId;
        const createdBy = body.createdBy;
        const status = body.status;

        if (!sanityChecks.isValidMongooseId(targetId) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId) &&
            !targetConfig.status.values.includes(status)) {
            console.log('ERROR ::: Missing info in "changeTargetStatus" service with info, targetId: ' + targetId +
                '. createdBy: ' + JSON.stringify(createdBy) + '. status: ' + status);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: targetId,
                status: { $ne: status }
            };
            const updateQuery = {
                status: status
            };
            if (status === targetConfig.status.completed) {
                updateQuery.completedOn = new Date().toISOString();
            }
            targetModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "changeTargetStatus" service error block with err: ' + err);
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
            console.log('ERROR ::: found in "changeTargetStatus" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    }
}
