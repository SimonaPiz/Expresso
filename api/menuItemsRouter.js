const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menuItemsRouter;

// Add param ':menuItemId' to set it in all Router
menuItemsRouter.param('menuItemId', (req, res, next, index) => {
  const menuItemId = Number(index);
  if (menuItemId && menuItemId >= 0) {  
    db.get(
      `SELECT * FROM MenuItem WHERE id = ?;`,
      [menuItemId],
      function (err, row) {
        if (err) {
          return next(err);
        } else if (row) {
          req.menuItem = row;
          req.menuItemId = menuItemId;
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

// PUT - Update menuItem by menuItemId
menuItemsRouter.put('/:menuItemId', validateData, (req, res, next) => {
  const updateMenuItem = req.body.menuItem;

  db.run(
    `UPDATE MenuItem SET 
    name ='${updateMenuItem.name}',
    description = '${updateMenuItem.description}',
    inventory = ${updateMenuItem.inventory},
    price = ${updateMenuItem.price}
    WHERE id = ${req.menuItemId};`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM MenuItem WHERE id = ${req.menuItemId};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(200).send({menuItem: row});
        }
      );
    }
  );
});