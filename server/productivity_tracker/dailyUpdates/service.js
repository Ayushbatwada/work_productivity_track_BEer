const updatesModel = require('./model');
const responseData = require('../../utils/responseData');
const sanityChecks  = require("../../utils/sanityChecks");

module.exports = {
    // Daily updates
    createDailyUpdate: (req, callback) => {
        let response;
        const body = req.body;
        const updateDescription = body.updateDescription;
        const createdBy = body.createdBy;

        if (!updateDescription || !createdBy || (createdBy && !createdBy.userId)) {
            console.log('ERROR ::: Missing info in createDailyUpdate service with info, updateDescription: ' + updateDescription +
                '. createdBy: ' + createdBy);
            response = new responseData.payloadError();
            return callback(null, response);
        }

        try {
            const update = new updatesModel();
            update.updateDescription = updateDescription;
            update.updateDate = new Date();
            update.createdBy = createdBy;
            update.updatedBy = createdBy;

            update.save().then((dbResp) => {
                response = new responseData.successMessage();
                response.data = dbResp;
                callback(null, response);
            }).catch((err) => {
                console.log('ERROR ::: found in db error catch block of createDailyUpdate service with err: ' + err);
                response = new responseData.serverError();
                callback(null, response);
            })
        } catch(err) {
            console.log('ERROR ::: found in catch block of createDailyUpdate service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    },

    editDailyUpdate: (req, callback) => {

    },

    getAllUpdates: (req, callback) => {
        let response;
        const userId = req.query.uid;
        const upId = req.query.upid;
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const filter = req.query.filter;
        const startDate = req.query.sd;
        const endDate = req.query.ed;

        if (!sanityChecks.isValidString(userId)) {
            console.log('ERROR ::: Missing info in getAllUpdates service with info, userId: ' + userId + '. upId: ' + upId);
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
            if (filter === 'dateRange' && sanityChecks.isValidDate(startDate) && sanityChecks.isValidDate(endDate)) {
                filterQuery['$and'] = [{ createdAt : { $gte : new Date(startDate) } }, { createdAt: { $lte : new Date(endDate) } }];
            }
            updatesModel.paginate(filterQuery, options, (err, dbResp) => {
                if (err) {
                    console.log('ERROR ::: found in getAllUpdates service with err: ' + err);
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
            console.log('ERROR ::: found in catch block of getAllUpdates service with err: ' + err);
            response = new responseData.serverError();
            callback(null, response);
        }
    }
}
