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

// Create function to validate new timesheet before adding to the database
const validateData = (req, res, next) => {
  const newData = req.body.timesheet;
  //console.log(newData);

  if (
    newData.hours < 0 || !newData.hours ||
    newData.rate  < 0 || !newData.rate ||
    newData.date  < 0 || !newData.date     
  ) {
    res.sendStatus(400);
    return;
  } else {
    //console.log('Data are valid');
    next();
  }
};

// POST - Create new timesheet
timesheetsRouter.post('/', validateData, (req, res, next) => {
  //console.log(req.body.timesheet);
  const newTimesheet = req.body.timesheet;

  db.run(
    `INSERT INTO Timesheet (hours, rate, date, employee_id)
    VALUES (
      ${newTimesheet.hours},
      ${newTimesheet.rate},
      ${newTimesheet.date},
      ${req.params.employeeId}
    );`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM Timesheet WHERE id = ${this.lastID};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(201).send({timesheet: row});
        }
      );
    }
  );
});