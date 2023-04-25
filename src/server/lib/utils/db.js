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

// // Create tables if they don't already exist
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

async function saveArtist(name, genius_id) {
  try {
    await db.run("INSERT INTO artists (name, genius_id) VALUES (?, ?)", [
      name,
      genius_id,
    ]);
    return `Artist ${name} saved to database successfully.`;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

async function getArtists(name) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM artists";
    let params = [];

    if (name) {
      query += " WHERE name LIKE ?";
      params.push(`%${name.trim()}%`);
    }

    db.get(query, params, (err, rows) => {
      if (err) {
        reject(err.message);
        throw err;
      }
      resolve(rows);
    });
  });
}

// // SONGS

async function getSongsByArtist(artist_id) {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM songs";
    let params = [];

    if (artist_id) {
      query += " WHERE artist_id = ?";
      params.push(`${artist_id}`);
    }

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err.message);
        throw err;
      }
      resolve(rows);
    });
  });

  return [];
}

function saveSong(song) {
  console.log("saveSong");
  console.log({ song });
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO songs (genius_id, artist_id, album_id, title, lyrics, complete) VALUES (?, ?, ?, ?, ?, ?)",
      [
        song.genius_id,
        song.artist_id,
        song.album_id,
        song.title,
        song.lyrics,
        song.complete,
      ],
      (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(`Song added successfully.`);
        }
      }
    );
  });
}

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
  getArtists,
  getSongsByArtist,
  saveSong,
  //   getSongs,
  //   saveAlbum,
  //   getAlbums,
};
