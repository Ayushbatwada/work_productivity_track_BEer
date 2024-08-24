'use strict'

const targetService = require('./service');
const responseData = require('../../utils/responseData');

module.exports = {
    createTarget: (req, res) => {
        let response;
        try {
            targetService.createTarget(req.body, (err, createTargetResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "createTarget" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(createTargetResponse.code).send(createTargetResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "createTarget" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);

        }
    },

    getAllTargets: (req, res) => {
        let response;
        try {
            targetService.getAllTargets(req, (err, getAllTargetsResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllTargets" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getAllTargetsResponse.code).send(getAllTargetsResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "getAllTargets" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    changeTargetStatus: (req, res) => {
        let response;
        try {
            targetService.changeTargetStatus(req.body, (err, changeTargetStatusResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "changeTargetStatus" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(changeTargetStatusResponse.code).send(changeTargetStatusResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "changeTargetStatus" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
