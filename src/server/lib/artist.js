const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

async function getArtistByName(artistName) {
  let artist = await db.artists.getArtists(artistName);

  // If the artist is not in the database, get it from Genius
  if (!artist) {
    artist = await geniusAPI.artistByName(artistName);
    if (artist.id) await db.artists.saveArtist(artist.name, artist.id);
  }

  return {
    name: artist.name || artistName,
    genius_id: artist.genius_id || artist.id,
  };
}

module.exports = {
  getArtistByName,
};
