const { readFile, writeFile } = require("./utils/files");
const GeniusAPI = require("../api/lyricistGeniusAPI");

async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  // Todo: Maybe this could be done in a more elegant way. SQLite?
  const dataAvailable = await readFile(`data/${artistName}/~songs.json`);
  if (dataAvailable) {
    const songsForArtist = JSON.parse(dataAvailable);
    return songsForArtist;
  }

  const geniusAPI = new GeniusAPI();
  const songsForArtist = await geniusAPI.songsByArtist(artistId);

  // Write songsForArtist to a file
  await writeFile("data/AllAesopSongs", JSON.stringify(songsForArtist));

  return { songData: songsForArtist };
}

module.exports = {
  getAllSongsForArtist,
};
