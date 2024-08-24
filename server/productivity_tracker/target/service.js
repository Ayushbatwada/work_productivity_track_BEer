'use strict'

const targetModel = require('./model');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    createTarget: (req, callback) => {
        let response;
        const body = req.body;
        const targetDescription = body.targetDescription;
        const associatedTaskIds = body.associatedTaskIds;
        const startDate = body.startDate;
        const dueDate = body.dueDate;
        const createdBy = body.createdBy;

        if (!targetDescription || !createdBy || (createdBy && !createdBy.userId) || !sanityChecks.isValidArray(associatedTaskIds)
            || !sanityChecks.isValidDate(startDate) || !sanityChecks.isValidDate(dueDate)) {
            console.log('ERROR ::: Missing info in createTarget service with info, targetDescription: ' + targetDescription +
                '. createdBy: ' + createdBy + '. associatedTaskIds: ' + associatedTaskIds + '. startDate: ' + startDate +
                '. dueDate: ' + dueDate);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const target = new targetModel({
                targetDescription: targetDescription,
                associatedTaskIds: associatedTaskIds,
                startDate: startDate,
                dueDate: dueDate,
                createdBy: createdBy,
                updatedBy: createdBy
            });

            target.save().then((dbResp) => {
                response = new responseData.successMessage();
                response.data = dbResp;
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in db error catch block of createTarget service with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            })
        } catch(err) {
            console.log('ERROR ::: found in catch block of createTarget service with err: ' + err);
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
        const startDate = req.query.sd;
        const dueDate = req.query.ed;

        if (!sanityChecks.isValidString(userId)) {
            console.log('ERROR ::: Missing info in getAllTargets service with info, userId: ' + userId);
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
                status: { $ne: 'deleted' },
                "createdBy.userId" : userId
            }
            if (filter === 'dateRange' && sanityChecks.isValidDate(startDate) && sanityChecks.isValidDate(dueDate)) {
                filterQuery['$and'] = [{ startDate : { $gte : new Date(startDate) } }, { endDate: { $lte : new Date(dueDate) } }];
            } else if (sanityChecks.isValidString(filter)) {
                filterQuery.status = filter
            }
            targetModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in getAllTargets service with err: ' + err);
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
        } catch(err) {
            console.log('ERROR ::: found in catch block of getAllTargets service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    editTarget: (req, callback) => {

    },

    changeTargetStatus: (req, callback) => {
        let response;
        const body = req.body;
        const targetId = body.targetId;
        const createdBy = body.createdBy;
        const status = body.status;

        if (!targetId || !createdBy || (createdBy && !createdBy.userId)) {
            console.log('ERROR ::: Missing info in changeTargetStatus service with info, targetId: ' + targetId +
                '. createdBy: ' + createdBy);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const filterQuery = {
                _id: targetId,
                status: { $ne: 'deleted' }
            }
            const updateQuery = {
                status: status
            }
            if (status === 'completed') {
                updateQuery.completedOn = new Date();
            }
            targetModel.findOneAndUpdate(filterQuery, updateQuery, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in changeTargetStatus service with err: ' + err);
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
        } catch(err) {
            console.log('ERROR ::: found in catch block of changeTargetStatus service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    }
}
