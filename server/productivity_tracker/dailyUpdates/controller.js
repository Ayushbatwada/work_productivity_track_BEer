'use strict'

const dailyUpdatesService = require('./service');
const responseData = require('../../utils/responseData');

module.exports = {
    // Daily updates
    createDailyUpdate: (req, res) => {
        let response;
        try {
            dailyUpdatesService.createDailyUpdate(req.body, (err, createDailyUpdateResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "createDailyUpdate" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(createDailyUpdateResponse.code).send(createDailyUpdateResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "createDailyUpdate" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getAllUpdates: (req, res) => {
        let response;
        try {
            dailyUpdatesService.getAllUpdates(req, (err, getAllUpdatesResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllUpdates" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getAllUpdatesResponse.code).send(getAllUpdatesResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "getAllUpdates" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
