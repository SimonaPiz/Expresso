const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = timesheetsRouter;

// GET /api/employees/:employeeId/timesheets
timesheetsRouter.get('/', (req, res, next) => {
  db.all(
    `SELECT * FROM Timesheet WHERE employee_id = ${req.params.employeeId};`,
    function (err, rows) {
      if (err) {
        return next(err);
      }
      res.status(200).send({timesheets: rows});
    }
  );
});