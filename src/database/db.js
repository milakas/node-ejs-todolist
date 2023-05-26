const mongoose = require('mongoose');
const DB_NAME = 'todoListDB';
require('dotenv').config();

class Database {
  constructor() {
    this.db = mongoose.connection;
  }

  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
        useNewUrlParser: true,
      });

      this.db.on('error', reject);
      this.db.once('open', () => {
        console.log(`Successfully connected to db ${DB_NAME}`);
        resolve();
      });
    });
  }
}

module.exports = new Database();
