const express = require("express");

const router = express.Router();

const { readFile, writeFile } = require("../lib/utils/files");
const { constructWordUsageTable } = require("../lib/wordUsageMap");

const GeniusAPI = require("../api/lyricistGeniusAPI");
const geniusAPI = new GeniusAPI();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const result = {};
  res.render("index", result);
});

router.get("/getAllAlbumsForArtist", async function (req, res, next) {
  const artistId = 178; // todo: This is Aesop Rock's id. We might have some sort of get id from string functionality
  const artistName = "Aesop Rock";

  //See if a file for Aesop Rock exists.
  const fileExists = await readFile(`data/${artistName}/~songs.json`);
  if (fileExists) {
    const songsForArtist = JSON.parse(fileExists);
    result.songsForArtist = songsForArtist;
    res.render("index", result);
    return;
  }

  const songsForArtist = await geniusAPI.songsByArtist(artistId);
  // Write songsForArtist to a file
  await writeFile("data/AllAesopSongs", JSON.stringify(songsForArtist));

  res.render("index", result);
});

router.get("/scrape", async function (req, res, next) {
  const artistId = 178; // todo: This is Aesop Rock's id. We might have some sort of get id from string functionality
  const artistName = "Aesop Rock";

  const songsForArtist = await geniusAPI.songsByArtist(artistId);

  // Only working with the first song for now. This will be expanded to be dynamic and for all songs.
  const sampleSong = songsForArtist[14];
  const songDetail = await geniusAPI.song(sampleSong.id, { fetchLyrics: true });

  var { album, albumData } = await getAlbumData(
    songDetail.album.id,
    artistName
  );

  const result = {
    artistName,
    albumCount: 20,
    albumName: album.name,
    songCount: albumData.songsWithLyrics.length,
    totalWords: albumData.songsWithLyrics.reduce(
      (acc, cur) => acc + cur.lyricsWordMap.length,
      0
    ),
    exclusions: 590,
    songResults: albumData,
  };

  res.render("index", result);
});

module.exports = router;
async function getAlbumData(albumId, artistName) {
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
