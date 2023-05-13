const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

// Unfortunately, the Genius API doesn't have a way to get album information without calling a "song detail" endpoint.
async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  // Get info from the database
  let songs = await db.getSongsByArtist(artistId);
  if (songs && songs.length > 0) return songs;

  // If the artist is not in the database, get it from Genius
  let songsForArtist = await geniusAPI.songReferencesByArtist(artistId);

  // todo: once we have this song, we might as well save it to the db?
  return songsForArtist;
}

async function getAlbumsFromSongs(songs) {
  return [];
}

function saveSong(songData) {}

async function getSongInfo(songId) {
  let song = await db.getSong(songId);
  console.log("song from db: ", song);
  if (song.id) return song;

  const songInformation = await geniusAPI.song(songId, { fetchLyrics: true });

  // TODO: standardize what this function returns. JSDOC?
  let returnStructure = {
    genius_id: songInformation.id,
    title: songInformation.title,
    artist: songInformation.artist,
    album: songInformation.album,
    lyrics: songInformation.lyrics,
  };

  return songInformation;
}

module.exports = {
  getAllSongsForArtist,
  getSongInfo,
};
