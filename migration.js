const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite');

// Create table Artist in database
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