const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

function getAllAlbumsForArtist(artistId) {}

async function getAlbumData(albumId) {
  const album = await geniusAPI.album(albumId, {
    fetchTracklist: true,
  });

  // const fileName = `./data/${artistName}_${album.name}_songLyrics.json`;
  // const currentFile = readFile(fileName);
  let albumData;

  //This means we don't have the lyrics and we have to scrape it.
  // const songsWithLyrics = await geniusAPI.getAlbumLyrics(album);
  // albumData = {
  //   artistName,
  //   albumName: album.name,
  //   songsWithLyrics,
  // };

  albumData.songsWithLyrics.forEach((item) => {
    const songWordUsage = constructWordUsageTable(item.lyrics);
    item["lyricsWordMap"] = songWordUsage;
  });

  return { album, albumData };
}
module.exports = {
  getAllAlbumsForArtist,
  getAlbumData,
};
