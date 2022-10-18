const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menusRouter;

// GET /api/menus
menusRouter.get('/', (req, res, next) => {
  db.all(
    `SELECT * FROM Menu;`,
    function (err, rows) {
      if (err) {
        return next(err);
      }
      res.status(200).send({menus: rows});
    }
  );
});