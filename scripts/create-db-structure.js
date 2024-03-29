const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "data/lyrics-data.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    createTables();
  }
});

function createTables() {
  db.run(
    `CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL, 
      genius_id INTEGER UNIQUE
    )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );

  db.run(
    `
    CREATE TABLE IF NOT EXISTS songs (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     genius_id INTEGER NOT NULL,
     artist_id INTEGER NOT NULL,
     album_id INTEGER NULL,     
     title TEXT NOT NULL,
     lyrics TEXT NULL,
     complete INTEGER NOT NULL,
     FOREIGN KEY (artist_id) REFERENCES artists(id)
     FOREIGN KEY (album_id) REFERENCES albums(id)
   )`,
    (err) => {
      if (err) {
        console.error(err.message);
        throw err;
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS albums (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT NOT NULL,
       artist_id INTEGER NOT NULL,
       FOREIGN KEY (artist_id) REFERENCES artists(id)
     )`,
    (err) => {
      if (err) {
        console.error(err.message);
        throw err;
      }
    }
  );
}
