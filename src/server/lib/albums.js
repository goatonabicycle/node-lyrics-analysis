function getAllAlbumsForArtist(artistId) {}

async function getAlbumData(albumId) {
  const album = await geniusAPI.album(albumId, {
    fetchTracklist: true,
  });

  const fileName = `./data/${artistName}_${album.name}_songLyrics.json`;
  const currentFile = readFile(fileName);
  let albumData;

  if (currentFile) {
    console.log("We already have the lyrics for this album");
    albumData = JSON.parse(currentFile);
  } else {
    //This means we don't have the lyrics and we have to scrape it.
    const songsWithLyrics = await geniusAPI.getAlbumLyrics(album);
    albumData = {
      artistName,
      albumName: album.name,
      songsWithLyrics,
    };

    console.log("Calling write file");
    writeFile(fileName, albumData);
  }

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
