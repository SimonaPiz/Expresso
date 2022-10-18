const express = require('express');
const apiRouter = express.Router();

module.exports = apiRouter;

//Import and connect employeesRouter for path 'api/employees'
const employeesRouter = require('./employeesRouter');
apiRouter.use('/employees', employeesRouter);

//Import and connect menusRouter for path 'api/menus'
const menusRouter = require('./menusRouter');
apiRouter.use('/menus', menusRouter);