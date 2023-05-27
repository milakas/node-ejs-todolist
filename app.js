const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const db = require('./database/db');
const ListService = require('./database/db');
const ItemService = require('./database/item');
const errorHandler = require('./errorHandle');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

(async () => {
  try {
    await db.connect();
  } catch (error) {
    console.error(`Failed to connect to the database`, err);
  }
})();

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(204);
});

app.get('/', async (req, res, next) => {
  try {
    await ItemService.renderDefaultList(res);
  } catch (error) {
    console.error(`Failed to render collection`, err);
  }
});

//Express Route Parameters
app.get('/:customListName', async (req, res) => {
  try {
    const customListName = _.capitalize(req.params.customListName);
    await ListService.renderCustomList(res, customListName);
  } catch (err) {
    console.error(`Failed to render custom list`, err);
  }
});

app.post('/', async (req, res) => {
  try {
    const itemName = req.body.newItem;
    const listTitle = req.body.list;

    const item = new ItemService.Item({
      name: itemName,
    });

    if (listTitle === 'Today') {
      await ItemService.addItemToDefaultList(item);
      res.redirect('/');
    } else {
      await ListService.addItemToCustomList(item, listTitle);
      res.redirect('/' + listTitle);
    }
  } catch (error) {
    console.error('Failed to add item', error);
  }
});

app.post('/delete', async (req, res) => {
  try {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === 'Today') {
      await ItemService.deleteItemByIdFromDefaultList(checkedItemId);
      res.redirect('/');
    } else {
      await ListService.deleteItemByIdFromCustomList(listName, checkedItemId);
      res.redirect('/' + listName);
    }
  } catch (error) {
    console.error(`Failed to delete item by id`, error);
  }
});

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});
