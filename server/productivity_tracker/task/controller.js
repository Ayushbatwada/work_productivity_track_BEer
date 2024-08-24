const taskService = require('./service');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    createTask: (req, res) => {
        let response;
        try {
            taskService.createTask(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside createTask controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside createTask controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of createTask controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);

        }
    },

    getAllTasks: (req, res) => {
        let response;
        try {
            taskService.getAllTasks(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside getAllTasks controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidArray(resp.data)) {
                    res.status(resp.code).send(resp);
                } else if (resp.code === 200 && !sanityChecks.isValidArray(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside getAllTasks controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of getAllTasks controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    editTask: (req, res) => {

    },

    changeTaskStatus: (req, res) => {
        let response;
        try {
            taskService.changeTaskStatus(req, (err, resp) => {
                if (err) {
                    console.log('ERROR ::: found inside changeTaskStatus controller with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.successMessage();
                    res.status(response.code).send(response);
                } else if (resp.code === 200 && !sanityChecks.isValidObject(resp.data)) {
                    response = new responseData.notFoundError();
                    res.status(response.code).send(response);
                } else {
                    console.log('ERROR ::: found inside changeTaskStatus controller with err: ' + err);
                    res.status(resp.code).send(resp);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside catch block of changeTaskStatus controller with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
