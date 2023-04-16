const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

async function getArtistByName(artistName) {
  let artist = await db.getArtists(artistName);
  console.log("Artist from database: ", artist);

  // If the artist is not in the database, get it from Genius
  if (!artist) {
    artist = await geniusAPI.artistByName(artistName);
    if (artist.id) await db.saveArtist(artist.name, artist.id);
  }

  return { name: artistName, genius_id: artist.genius_id || artist.id };
}

module.exports = {
  getArtistByName,
};
