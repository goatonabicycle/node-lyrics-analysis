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

  // Write songsForArtist to a file
  await writeFile("data/AllAesopSongs", JSON.stringify(songsForArtist));

  return { songData: songsForArtist };
}

async function getSongInfo(songId) {
  const songInformation = await geniusAPI.song(songId);
  return songInformation;
}

module.exports = {
  getAllSongsForArtist,
  getSongInfo,
};
