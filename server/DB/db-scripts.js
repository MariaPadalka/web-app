const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('DB/TaskManager.db'); 

const runSqlScript = (scriptPath) => {
  fs.readFile(scriptPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading SQL script:', err);
      return;
    }

    db.serialize(() => {
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'", (err, row) => {
        if (err) {
          console.error('Error checking for table existence:', err);
        } else if (row) {
            console.log("Database already exists");
          return;
        } else {
          db.exec(data, (err) => {
            if (err) {
              console.error('Error executing SQL script:', err);
            } else {
              console.log('SQL script executed successfully.');
            }
          });

          db.close((err) => {
            if (err) {
              console.error('Error closing the database:', err);
            }
          });
        }
      });
    });
  });
};

module.exports = runSqlScript;
