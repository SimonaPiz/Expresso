const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menuItemsRouter;

// GET /api/menus/:menuId/menu-items
menuItemsRouter.get('/', (req, res, next) => {
  db.all(
    `SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId};`,
    function (err, rows) {
      if (err) {
        return next(err);
      }
      res.status(200).send({menuItems: rows});
    }
  );
});
