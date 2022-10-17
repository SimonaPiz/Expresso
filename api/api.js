const express = require('express');
const apiRouter = express.Router();

module.exports = apiRouter;

//Import and connect employeeRouter for path 'api/employee'
const employeeRouter = require('./employeeRouter');
apiRouter.use('/employee', employeeRouter);