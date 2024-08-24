'use strict'

const updatesModel = require('./model');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');
const dailyUpdatesConfig = require('./config.json');

module.exports = {
    // Daily updates
    createDailyUpdate: (body, callback) => {
        let response;
        const updateDescription = body.updateDescription;
        const createdBy = body.createdBy;

        if (!sanityChecks.isValidString(updateDescription) || !createdBy || !sanityChecks.isValidMongooseId(createdBy.userId)) {
            console.log('ERROR ::: Missing info in createDailyUpdate service with info, updateDescription: ' + updateDescription +
                '. createdBy: ' + createdBy);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const update = new updatesModel();
            update.description = updateDescription;
            update.updateDate = new Date();
            update.createdBy = createdBy;
            update.updatedBy = createdBy;

            update.save().then((dbResp) => {
                response = new responseData.successMessage();
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in "createDailyUpdate" service db error block with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            })
        } catch(err) {
            console.log('ERROR ::: found in "createDailyUpdate" catch error service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    getAllUpdates: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const filter = req.query.filter;
        const startDate = req.query.sd;
        const endDate = req.query.ed;

        if (!sanityChecks.isValidMongooseId(userId)) {
            console.log('ERROR ::: Missing info in getAllUpdates service with info, userId: ' + userId);
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
                status: dailyUpdatesConfig.status.active,
                "createdBy.userId" : userId
            }
            if (filter === 'dateRange' && sanityChecks.isValidDate(startDate) && sanityChecks.isValidDate(endDate)) {
                filterQuery['$and'] = [
                    { createdAt : { $gte : new Date(startDate) } },
                    { createdAt: { $lte : new Date(endDate) } }
                ];
            }
            updatesModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in "getAllUpdates" service error block with err: ' + err);
                    response = new responseData.serverError();
                    callback(null, response);
                } else if (sanityChecks.isValidArray(dbResp.data)) {
                    response = new responseData.successMessage();
                    response = {...response, ...dbResp}
                    callback(null, response);
                } else {
                    response = new responseData.notFoundError();
                    callback(null, response);
                }
            })
        } catch(err) {
            console.log('ERROR ::: found in "getAllUpdates" service catch block with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    }
}
