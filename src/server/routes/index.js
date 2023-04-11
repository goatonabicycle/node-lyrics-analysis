const express = require("express");

const router = express.Router();

const { readFile, writeFile } = require("../lib/utils/files");
const { constructWordUsageTable } = require("../lib/wordUsageMap");

const GeniusAPI = require("../api/lyricistGeniusAPI");
const geniusAPI = new GeniusAPI();

const { getAllSongsForArtist, getSongInfo } = require("../lib/songs");
const { getAlbumData } = require("../lib/albums");
const { getArtistByName } = require("../lib/artist");

/* GET home page. */
router.get("/", async function (req, res, next) {
  let result = {};
  res.render("index", result);
});

router.get("/test", async function (req, res, next) {
  // We start with artist stuff.
  const artistName = "Aesop Rock";
  const artistId = getArtistByName(artistName);
  // TODO: Store this artist in the database.

  // Then we get all songs for that artist.
  const songsForArtist = await getAllSongsForArtist(artistName, artistId);
  // TODO: Store this song in the database linked to this artist.
  console.log(songsForArtist);
  const albumIds = [];

  let limitTo = 5;
  let currentItem = 0;
  // for each song in songsForArtist we need to first make a "Song details" call.
  for (const song of songsForArtist.songData) {
    if (currentItem == limitTo) break;

    // Then we get all the information relating to that song.
    const songDetail = await getSongInfo(song.id);

    if (!songDetail.album) break; // Let's worry about songs without an album later.

    // if the songDetail has an albumId we haven't already seen, add it to the albumIds array
    if (!albumIds.includes(songDetail.album.id)) {
      console.log(`Album getting added: ${songDetail.album.id}`);
      albumIds.push(songDetail.album.id);
    }

    currentItem++;
  }

  console.log(albumIds);

  // const songsForArtist = await geniusAPI.songsByArtist(artistId);

  // // Only working with the first song for now. This will be expanded to be dynamic and for all songs.
  // const sampleSong = songsForArtist[14];
  // const songDetail = await geniusAPI.song(sampleSong.id, { fetchLyrics: true });

  // var { album, albumData } = await getAlbumData(
  //   songDetail.album.id,
  //   artistName
  // );

  // const result = {
  //   artistName,
  //   albumCount: 20,
  //   albumName: album.name,
  //   songCount: albumData.songsWithLyrics.length,
  //   totalWords: albumData.songsWithLyrics.reduce(
  //     (acc, cur) => acc + cur.lyricsWordMap.length,
  //     0
  //   ),
  //   exclusions: 590,
  //   songResults: albumData,
  // };
  let result = {};
  res.render("index", result);
});

module.exports = router;
