const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

async function getArtistByName(artistName) {
  return await geniusAPI.artistByName(artistName);
}

async function saveArtist(artist) {
  let result = await db.saveArtist(artist.name);
  console.log(result);
}

module.exports = {
  getArtistByName,
  saveArtist,
};
