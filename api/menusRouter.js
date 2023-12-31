const express = require('express');
const menusRouter = express.Router();
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menusRouter;

// Add param ':menuId' to set it in all Router
menusRouter.param('menuId', (req, res, next, index) => {
  const menuId = Number(index);
  if (menuId && menuId >= 0) {  
    db.get(
      `SELECT * FROM Menu WHERE id = ?;`,
      [menuId],
      function (err, row) {
        if (err) {
          return next(err);
        } else if (row) {
          req.menu = row;
          req.menuId = menuId;
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

// GET /api/menus/:menuId
menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).send({menu: req.menu});
});

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

// Create function to validate new menu before adding to the database
const validateData = (req, res, next) => {
  const newData = req.body.menu;
  //console.log(newData);

  if (
    typeof newData.title !== 'string' || !newData.title
  ) {
    res.sendStatus(400);
    return;
  } else {
    //console.log('Data are valid');
    next();
  }
};

// POST - Create new menu
menusRouter.post('/', validateData, (req, res, next) => {
  //console.log(req.body.menu);
  const newMenu = req.body.menu;

  db.run(
    `INSERT INTO Menu (title)
    VALUES ('${newMenu.title}');`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM Menu WHERE id = ${this.lastID};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(201).send({menu: row});
        }
      );
    }
  );
});

// PUT - Update menu by menuId
menusRouter.put('/:menuId', validateData, (req, res, next) => {
  const updateMenu = req.body.menu;
  //console.log(updateMenu);

  db.run(
    `UPDATE Menu SET 
    title = '${updateMenu.title}'
    WHERE id = ${req.menuId};`,
    function (err) {
      if (err) {
        return next(err);
      }
      db.get(
        `SELECT * FROM Menu WHERE id = ${req.menuId};`,
        (err, row) => {
          if (err) {
            return next(err);
          }
          res.status(200).send({menu: row});
        }
      );
    }
  );
});

// DELETE - Delete menu by its id
menusRouter.delete('/:menuId', (req, res, next) => {
  db.all(
    `SELECT * FROM  MenuItem
    WHERE menu_id = ${req.menuId};`,
    function(err, rows) {
      if (rows.length === 0) {
        db.run(
          `DELETE FROM Menu 
          WHERE id = ${req.menuId};`,
          function(err) {            
            res.sendStatus(204);
          } 
        );
      } else {
        res.sendStatus(400);
      }

    }
  );
});

//Import and connect menuItemsRouter for path 'api/menus/:menuId/menu-items'
const menuItemsRouter = require('./menuItemsRouter');
menusRouter.use('/:menuId/menu-items', menuItemsRouter);