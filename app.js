const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();
const port = 3000;

const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'errors.log');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const items = ['Buy Food'];
const workItems = [];

app.get('/', (req, res, next) => {
  try {
    const day = date.getDate();
    res.render('list', { listTitle: day, newListItems: items });
  } catch (error) {
    const errorMessage = `Failed to get date: ${error.message}`;
    next(new Error(errorMessage));
  }
});

app.post('/', (req, res) => {
  const item = req.body.newItem;
  console.log(req.body.list);
  if (req.body.list === 'Work List') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.post('/work', (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});

app.use((err, req, res, next) => {
  // логируем ошибку в файл errors.log
  fs.appendFile(
    logFilePath,
    `${new Date().toISOString()} - ${err.stack}\n`,
    (err) => {
      if (err) console.error(err);
    }
  );
  res
    .status(500)
    .send(
      'Internal Server Error: Something went wrong. Please try again later.'
    );
});
