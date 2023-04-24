const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

// Unfortunately, the Genius API doesn't have a way to get album information without calling a "song detail" endpoint.
async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  console.log("Getting songs for artist: ", artistName);
  // Get info from the database
  let songs = await db.getSongsByArtist(artistId);
  console.log("Songs from database: ", songs);

  if (songs && songs.length > 0) return songs;

  // If the artist is not in the database, get it from Genius
  songsForArtist = await geniusAPI.songReferencesByArtist(artistId);

  console.log("Songs from API: ", songsForArtist);
  // Save each individual song to the database
  for (let i = 0; i < songsForArtist.length; i++) {
    let song = songsForArtist[i];
    song.complete = 0;
    song.lyrics = "";
    song.album_id = 0;
    song.artist_id = artistId;
    await db.saveSong(song);
  }

  return songsForArtist;
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
