const express = require("express");
var config = require("../config.json");
const router = express.Router();

const {
  readFile,
  writeFile
} = require("../lib/utils/files");
const {
  constructCountTable
} = require("../lib/wordUsageMap");

const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPIKey = config.GeniuAPIkey;
const geniusAPI = new GeniusAPI(geniusAPIKey);

/* GET home page. */
router.get("/", async function (req, res, next) {
  const result = {};
  res.render("index", result);
});

router.get("/scrape", async function (req, res, next) {
  const artistId = 178; // todo: This is Aesop Rock's id. We might have some sort of get id from string functionality
  const artistName = "Aesop Rock";

  const songsForArtist = await geniusAPI.songsByArtist(artistId);

  // Only working with the first song for now. This will be expanded to be dynamic and for all songs.
  const sampleSong = songsForArtist[10];
  const songDetail = await geniusAPI.song(sampleSong.id, {
    fetchLyrics: true,
  });

  const album = await geniusAPI.album(songDetail.album.id, {
    fetchTracklist: true,
  });

  const fileName = `./data/${artistName}_${album.name}_songLyrics.json`;
  const currentFile = readFile(fileName);
  let albumData

  if (currentFile) {
    albumData = JSON.parse(currentFile);
  } else {
    //This means we don't have the lyrics and we have to scrape it.
    const songsWithLyrics = await geniusAPI.getAlbumLyrics(album);
    albumData = {
      artistName,
      albumName: album.name,
      songsWithLyrics,
    }

    writeFile(fileName, albumData);
  }

  albumData.songsWithLyrics.forEach((item) => {
    const songWordUsage = constructCountTable(item.lyrics);
    item["lyricsWordMap"] = songWordUsage;
  })

  const result = {
    artistName,
    albumCount: 20,
    songCount: 149,
    totalWords: 189246,
    exclusions: 590,
    songResults: albumData,
  };

  res.render("index", result);
});

module.exports = router;