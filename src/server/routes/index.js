const express = require("express");

const router = express.Router();

const { readFile, writeFile } = require("../lib/utils/files");
const { constructWordUsageTable } = require("../lib/wordUsageMap");

const GeniusAPI = require("../api/lyricistGeniusAPI");
const geniusAPI = new GeniusAPI();

const { getAllSongsForArtist } = require("../lib/songs");
const { getArtistByName } = require("../lib/artist");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const result = {};
  res.render("index", result);
});

router.get("/getAllAlbumsForArtist", async function (req, res, next) {
  // const artistId = 178; // todo: This is Aesop Rock's id. We might have some sort of get id from string functionality
  const artistName = "Aesop Rock";
  const artistId = getArtistByName(artistName);

  // const songsForArtist = await getAllSongsForArtist(artistName, artistId);
  // console.log(songsForArtist);
  // const albumIds = [];

  // let limitTo = 5;
  // let currentItem = 0;
  // // for each song in songsForArtist we need to first make a "Song details" call.
  // for (const song of songsForArtist.songData) {
  //   if (currentItem == limitTo) break;

  //   const songDetail = await geniusAPI.song(song.id, { fetchLyrics: false });

  //   // if the songDetail has an albumId we haven't already seen, add it to the albumIds array
  //   if (!albumIds.includes(songDetail.album_id)) {
  //     console.log(`Album getting added: ${songDetail.album_id}`);
  //     albumIds.push(songDetail.album_id);
  //   }

  //   currentItem++;
  // }

  // console.log(albumIds);

  // Todo: Now that we have all the songs for the artist, we can construct the table in order to determine all the albums.
  let result = "";
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
