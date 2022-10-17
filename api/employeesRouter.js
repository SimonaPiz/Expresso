const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = employeesRouter;

// GET /api/employee
employeesRouter.get('/', (req, res, next) => {
  db.all(
    `SELECT * FROM Employee WHERE is_current_employee = 1;`,
    function (err, rows) {
      if (err) {
        return next(err);
      }
      res.status(200).send({employees: rows});
    }
  );
});