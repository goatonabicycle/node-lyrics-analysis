const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

async function getArtistByName(artistName) {
  let artistId = await geniusAPI.artistByName(artistName);
  if (artistId) saveArtist({ name: artistName, id: artistId });
  return artistId;
}

async function saveArtist(artist) {
  let result = await db.saveArtist(artist.name);
  console.log(result);
}

module.exports = {
  getArtistByName,
  saveArtist,
};
