const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "mydatabase.sqlite";

// let db = new sqlite3.Database(DBSOURCE, (err) => {
//   if (err) {
//     console.error(err.message);
//     throw err;
//   } else {
//     console.log("Connected to the SQLite database.");
//     createTables();
//   }
// });

// // Create tables if they don't already exist
function createTables() {
  db.run(
    `CREATE TABLE IF NOT EXISTS artists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`,
    (err) => {
      if (err) {
        console.error(err.message);
      }
    }
  );

  //   db.run(
  //     `CREATE TABLE IF NOT EXISTS songs (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     title TEXT NOT NULL,
  //     lyrics TEXT NOT NULL,
  //     artist_id INTEGER NOT NULL,
  //     FOREIGN KEY (artist_id) REFERENCES artists(id)
  //   )`,
  //     (err) => {
  //       if (err) {
  //         console.error(err.message);
  //         throw err;
  //       }
  //     }
  //   );

  //   db.run(
  //     `CREATE TABLE IF NOT EXISTS albums (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     title TEXT NOT NULL,
  //     artist_id INTEGER NOT NULL,
  //     FOREIGN KEY (artist_id) REFERENCES artists(id)
  //   )`,
  //     (err) => {
  //       if (err) {
  //         console.error(err.message);
  //         throw err;
  //       }
  //     }
  //   );
}

// // ARTISTS

function saveArtist(name) {
  // return new Promise((resolve, reject) => {
  //   db.run("INSERT INTO artists (name) VALUES (?)", [name], (err) => {
  //     if (err) {
  //       console.error(err.message);
  //       reject(err);
  //     } else {
  //       resolve(`Artist ${name} added successfully.`);
  //     }
  //   });
  // });
}

// function getArtists() {
//   return new Promise((resolve, reject) => {
//     db.all("SELECT * FROM artists", [], (err, rows) => {
//       if (err) {
//         console.error(err.message);
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// }

// // SONGS

// function saveSong(title, lyrics, artist_id) {
//   return new Promise((resolve, reject) => {
//     db.run(
//       "INSERT INTO songs (title, lyrics, artist_id) VALUES (?, ?, ?)",
//       [title, lyrics, artist_id],
//       (err) => {
//         if (err) {
//           console.error(err.message);
//           reject(err);
//         } else {
//           resolve(`Song ${title} added successfully.`);
//         }
//       }
//     );
//   });
// }

// function getSongs() {
//   return new Promise((resolve, reject) => {
//     db.all("SELECT * FROM songs", [], (err, rows) => {
//       if (err) {
//         console.error(err.message);
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// }

// // ALBUMS

// function saveAlbum(title, artist_id) {
//   return new Promise((resolve, reject) => {
//     db.run(
//       "INSERT INTO albums (title, artist_id) VALUES (?, ?)",
//       [title, artist_id],
//       (err) => {
//         if (err) {
//           console.error(err.message);
//           reject(err);
//         } else {
//           resolve(`Album ${title} added successfully.`);
//         }
//       }
//     );
//   });
// }

// function getAlbums() {
//   return new Promise((resolve, reject) => {
//     db.all("SELECT * FROM albums", [], (err) => {
//       if (err) {
//         console.error(err.message);
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// }

module.exports = {
  saveArtist,
  //   getArtists,
  //   saveSong,
  //   getSongs,
  //   saveAlbum,
  //   getAlbums,
};
