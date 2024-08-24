const targetService = require('./service');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    createTarget: (req, res) => {
        let response;
        try {
            targetService.createTarget(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside createTarget controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside createTarget controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of createTarget controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);

        }
    },

    getAllTargets: (req, res) => {
        let response;
        try {
            targetService.getAllTargets(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside getAllTargets controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidArray(resp.data)) {
                    res.status(resp.code).send(resp);
                } else if (resp.code === 200 && !sanityChecks.isValidArray(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside getAllTargets controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of getAllTargets controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    editTarget: (req, res) => {

    },

    changeTargetStatus: (req, res) => {
        let response;
        try {
            targetService.changeTargetStatus(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside changeTargetStatus controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && !sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside changeTargetStatus controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of changeTargetStatus controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
