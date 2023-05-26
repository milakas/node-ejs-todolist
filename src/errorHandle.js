const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'errors.log');

const logErrorToFile = (err) => {
  const errorMessage = `${new Date().toISOString()} - ${err.stack}\n`;

  fs.appendFile(logFilePath, errorMessage, (err) => {
    if (err) console.error('Failed to log error to file', err);
  });
};

const errorHandler = (err, req, res, next) => {
  logErrorToFile(err);

  res
    .status(500)
    .send(
      'Internal Server Error: Something went wrong. Please try again later.'
    );
};

module.exports = errorHandler;
