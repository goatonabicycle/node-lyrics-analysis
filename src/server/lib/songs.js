const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

// Unfortunately, the Genius API doesn't have a way to get album information without calling a "song detail" endpoint.
async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  console.log("Getting songs for artist: ", artistName);
  // Get info from the database

  // let songs = await db.getSongsByArtist(artistId);
  // if (songs && songs.length > 0) return songs;

  // If the artist is not in the database, get it from Genius
  let songsForArtist = await geniusAPI.songReferencesByArtist(artistId);

  return songsForArtist;
}

async function getAlbumsFromSongs(songs) {
  return [];
}

function saveSong(songData) {}

async function getSongInfo(songId) {
  // TODO: See if song info is available in the db.
  const songInformation = await geniusAPI.song(songId, { fetchLyrics: true });
  return songInformation;
}

module.exports = {
  getAllSongsForArtist,
  getSongInfo,
};
