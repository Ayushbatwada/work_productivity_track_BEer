const taskService = require('./service');
const responseData = require('../../utils/responseData');
const sanityChecks  = require('../../utils/sanityChecks');

module.exports = {
    createTask: (req, res) => {
        let response;
        try {
            taskService.createTask(req.body, (err, createTaskResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "createTask" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(createTaskResponse.code).send(createTaskResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "createTask" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    getAllTasks: (req, res) => {
        let response;
        try {
            taskService.getAllTasks(req, (err, getAllTasksResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "getAllTasks" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(getAllTasksResponse.code).send(getAllTasksResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "getAllTasks" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    },

    changeTaskStatus: (req, res) => {
        let response;
        try {
            taskService.changeTaskStatus(req.body, (err, changeTaskStatusResponse) => {
                if (err) {
                    console.log('ERROR ::: found inside "changeTaskStatus" controller error block with err: ' + err);
                    response = new responseData.serverError();
                    res.status(response.code).send(response);
                } else {
                    res.status(changeTaskStatusResponse.code).send(changeTaskStatusResponse);
                }
            });
        } catch(err) {
            console.log('ERROR ::: found inside "changeTaskStatus" controller catch block with err: ' + err);
            response = new responseData.serverError();
            res.status(response.code).send(response);
        }
    }
}
