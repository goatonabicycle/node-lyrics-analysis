const { readFile, writeFile } = require("./utils/files");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

// Unfortunately, the Genius API doesn't have a way to get album information without calling a "song detail" endpoint.
async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  // Todo: Maybe this could be done in a more elegant way. SQLite?
  const dataAvailable = await readFile(`data/${artistName}/~songs.json`);
  if (dataAvailable) {
    const songsForArtist = JSON.parse(dataAvailable);
    return songsForArtist;
  }

  const songsForArtist = await geniusAPI.songsByArtist(artistId);
  // Save the info to the db here.

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
