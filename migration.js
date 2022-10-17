const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');

// Create table Employee in database
db.run(`CREATE TABLE IF NOT EXISTS Employee (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  wage INTEGER NOT NULL,
  is_current_employee INTEGER DEFAULT 1
);`, function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Employee table is correctly created');
    return;
  }
});

// Create table Timesheet in database
db.run(`CREATE TABLE IF NOT EXISTS Timesheet (
  id INTEGER PRIMARY KEY NOT NULL,
  hours INTEGER NOT NULL,
  rate INTEGER NOT NULL,
  date INTEGER NOT NULL,
  employee_id INTEGER NOT NULL REFERENCES Employee(id)
);`, function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Timesheet table is correctly created');
    return;
  }
});

// Create table Menu in database
db.run(`CREATE TABLE IF NOT EXISTS Menu (
  id INTEGER PRIMARY KEY NOT NULL,
  title TEXT NOT NULL
);`, function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Menu table is correctly created');
    return;
  }
});

// Create table MenuItem in database
db.run(`CREATE TABLE IF NOT EXISTS MenuItem (
  id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  inventory INTEGER NOT NULL,
  price INTEGER NOT NULL,
  menu_id INTEGER NOT NULL REFERENCES Menu(id)
);`, function (err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('MenuItem table is correctly created');
    return;
  }
});