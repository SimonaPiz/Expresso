const express = require('express');
const timesheetsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = timesheetsRouter;

// Add param ':timesheetId' to set it in all Router
timesheetsRouter.param('timesheetId', (req, res, next, index) => {
  const timesheetId = Number(index);
  if (timesheetId && timesheetId >= 0) {  
    db.get(
      `SELECT * FROM Timesheet WHERE id = ?;`,
      [timesheetId],
      function (err, row) {
        if (err) {
          return next(err);
        } else if (row) {
          req.timesheet = row;
          req.timesheetId = timesheetId;
          next();
        } else {
          res.sendStatus(404);
          return;
        }
      }
    );
  } else {
    res.sendStatus(404);
    return;
  }
});

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

// PUT - Update timesheet by timesheetId
timesheetsRouter.put('/:timesheetId', validateData, (req, res, next) => {
  const updateTimesheet = req.body.timesheet;
  db.run(
    `UPDATE Timesheet SET 
    hours = ${updateTimesheet.hours},
    rate = ${updateTimesheet.rate},
    date = ${updateTimesheet.date}
    WHERE id = ${req.timesheetId};`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM Timesheet WHERE id = ${req.timesheetId};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(200).send({timesheet: row});
        }
      );
    }
  );
});