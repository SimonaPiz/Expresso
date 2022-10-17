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

// Create function to validate new employee before adding to the database
const validateData = (req, res, next) => {
  const newData = req.body.employee;
  //console.log(newData);

  if (
    typeof newData.name !== 'string' || !newData.name ||
    typeof newData.position !== 'string' || !newData.position ||
    newData.wage < 0 || !newData.wage
  ) {
    res.sendStatus(400);
    return;
  } else {
    //console.log('Data are valid');
    next();
  }
};

// POST - Create new employee
employeesRouter.post('/', validateData, (req, res, next) => {
  //console.log(req.body.employee);
  const newEmployee = req.body.employee;
  newEmployee.isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  db.run(
    `INSERT INTO Employee (name, position, wage, is_current_employee)
    VALUES (
      '${newEmployee.name}',
      '${newEmployee.position}',
      '${newEmployee.wage}',
      ${newEmployee.isCurrentEmployee}
    );`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM Employee WHERE id = ${this.lastID};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(201).send({employee: row});
        }
      );
    }
  );
});