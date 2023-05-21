const mongoose = require('mongoose');
const DB_NAME = 'todoListDB';

class Database {
  constructor() {
    this.db = mongoose.connection;
  }

  connect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`, {
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
