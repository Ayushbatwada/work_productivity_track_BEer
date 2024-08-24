const healthCheck = require('./server/utils/healthCheck');
const folderRouter = require('./server/productivity_tracker/folder/routes');
const taskRouter = require('./server/productivity_tracker/task/routes');
const targetRouter = require('./server/productivity_tracker/target/routes');
const dailyUpdatesRouter = require('./server/productivity_tracker/dailyUpdates/routes');

module.exports = (app) => {
    app.use('/healthCheck', healthCheck);

    app.use('v1/api/productivity/tracker', folderRouter);
}
