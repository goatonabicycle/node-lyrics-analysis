const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "data/lyrics-data.sqlite";

let db;

function connect() {
  db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
      //console.log("Connected to the SQLite database.");
    }
  });
}

const artists = {
  async saveArtist(name, genius_id) {
    try {
      connect();
      await db.run("INSERT INTO artists (name, genius_id) VALUES (?, ?)", [
        name,
        genius_id,
      ]);
      return `Artist ${name} saved to database successfully.`;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  async getArtists(name) {
    connect();
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
  },
};

const songs = {
  async getSongsByArtist(artist_id) {
    connect();
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
  },

  saveSong(song) {
    connect();
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
  },

  getSong(id) {
    connect();
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM songs WHERE genius_id = ?", [id], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
};

module.exports = {
  artists,
  songs,
};
