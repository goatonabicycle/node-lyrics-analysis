const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("example.db");

db.serialize(() => {
  // Create a table
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");

  // Insert some data
  db.run("INSERT INTO users (name) VALUES (?)", ["Alice"]);
  db.run("INSERT INTO users (name) VALUES (?)", ["Bob"]);
  db.run("INSERT INTO users (name) VALUES (?)", ["Charlie"]);

  // Query the data
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(rows);
    }
  });
});

db.close();
