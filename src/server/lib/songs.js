const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

// Unfortunately, the Genius API doesn't have a way to get album information without calling a "song detail" endpoint.
async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  // Get info from the database
  let songs = await db.getSongsByArtist(artistId);
  console.log("Songs from database: ", artist);

  // If the artist is not in the database, get it from Genius
  if (!songs) {
    songsForArtist = await geniusAPI.songsByArtist(artistId);
    // Save each individual song to the database
    for (let i = 0; i < songsForArtist.length; i++) {
      let song = songsForArtist[i];
      song.complete = 0;
      await db.saveSong(song);
    }
  }

  return songsForArtist;

  // ---------------------------------------

  return songs;
}

async function getAlbumsFromSongs(songs) {
  return [];
}

function saveSong(songData) {}

async function getSongInfo(songId) {
  // TODO: See if song info is available in the db.
  const songInformation = await geniusAPI.song(songId);
  return songInformation;
}

module.exports = {
  getAllSongsForArtist,
  getSongInfo,
};
