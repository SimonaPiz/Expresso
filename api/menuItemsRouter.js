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

// Create function to validate new menuItem before adding to the database
const validateData = (req, res, next) => {
  const newData = req.body.menuItem;
  //console.log(newData);

  if (
    typeof newData.name !== 'string' || !newData.name ||
    typeof newData.description !== 'string' ||
    newData.inventory < 0 || !newData.inventory ||
    newData.price < 0 || !newData.price
  ) {
    res.sendStatus(400);
    return;
  } else {
    //console.log('Data are valid');
    next();
  }
};

// POST - Create new menuItem
menuItemsRouter.post('/', validateData, (req, res, next) => {
  //console.log(req.body.menuItem);
  const newMenuItem = req.body.menuItem;

  db.run(
    `INSERT INTO MenuItem (name, description, inventory, price, menu_id)
    VALUES (
      '${newMenuItem.name}',
      '${newMenuItem.description}',
      ${newMenuItem.inventory},
      ${newMenuItem.price},
      ${req.params.menuId}
    );`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM MenuItem WHERE id = ${this.lastID};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(201).send({menuItem: row});
        }
      );
    }
  );
});
