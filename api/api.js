const express = require('express');
const apiRouter = express.Router();

module.exports = apiRouter;

//Import and connect employeeRouter for path 'api/employee'
const employeesRouter = require('./employeesRouter');
apiRouter.use('/employees', employeesRouter);