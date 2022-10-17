const express = require('express');
const employeesRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = employeesRouter;

// Add param ':employeeId' to set it in all Router
employeesRouter.param('employeeId', (req, res, next, index) => {
  const employeeId = Number(index);
  if (employeeId && employeeId >= 0) {  
    db.get(
      `SELECT * FROM Employee WHERE id = ?;`,
      [employeeId],
      function (err, row) {
        if (err) {
          return next(err);
        } else if (row) {
          req.employee = row;
          req.employeeId = employeeId;
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

// GET /api/employees/:employeeId
employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).send({employee: req.employee});
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

// PUT - Update employee by employeeId
employeesRouter.put('/:employeeId', validateData, (req, res, next) => {
  const updateEmployee = req.body.employee;
  //console.log(updateEmployee);
  updateEmployee.isCurrentEmployee = req.query.isCurrentEmployee === 0 ? 0 : 1;

  db.run(
    `UPDATE Employee SET 
    name = '${updateEmployee.name}',
    position = '${updateEmployee.position}',
    wage = '${updateEmployee.wage}',
    is_current_employee = ${updateEmployee.isCurrentEmployee}
    WHERE id = ${req.employeeId};`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM Employee WHERE id = ${req.employeeId};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(200).send({employee: row});
        }
      );
    }
  );
});