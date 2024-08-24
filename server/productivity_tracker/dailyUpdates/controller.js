const dailyUpdatesService = require('./service');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    // Daily updates
    createDailyUpdate: (req, res) => {
        let response;
        try {
            dailyUpdatesService.createDailyUpdate(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside createDailyUpdate controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside createDailyUpdate controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of createDailyUpdate controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);

        }
    },

    editDailyUpdate: (req, res) => {

    },

    getAllUpdates: (req, res) => {
        let response;
        try {
            dailyUpdatesService.getAllUpdates(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside getAllUpdates controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidArray(resp.data)) {
                    res.status(resp.code).send(resp);
                } else if (resp.code === 200 && !sanityChecks.isValidArray(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside getAllUpdates controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of getAllUpdates controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
