const db = require("../lib/utils/db");
const GeniusAPI = require("../api/lyricistGeniusAPI");

const geniusAPI = new GeniusAPI();

// Unfortunately, the Genius API doesn't have a way to get album information without calling a "song detail" endpoint.
async function getAllSongsForArtist(artistName, artistId) {
  if (!artistName) return;
  if (!artistId) return;

  console.log("Getting all DB songs for artist: ", artistName, artistId);
  // Get info from the database
  let songs = await db.songs.getSongsByArtist(artistId);
  console.log("songs from db: ", songs);
  if (songs && songs.length > 0) return songs;

  // // If the artist is not in the database, get it from Genius
  // let songsForArtist = await geniusAPI.songReferencesByArtist(artistId);

  // // Get the first ten items from songsForArtist
  // const firstFew = songsForArtist.slice(0, 10);

  // // songsForArtist = songsForArtist

  // //Using all of these songs, get their details using the Genius API.
  // const songData = await Promise.all(
  //   firstFew.map(async (song) => {
  //     const songDetail = await getSongInfo(song.genius_id);
  //     // Save each individual song to the database

  //     let thisSong = songDetail;
  //     thisSong.complete = 1;
  //     thisSong.lyrics = thisSong.lyrics;
  //     thisSong.genius_id = thisSong.id;
  //     thisSong.album_id = thisSong.album?.id;
  //     thisSong.artist_id = artist.genius_id;
  //     // await db.songs.saveSong(thisSong);

  //     return thisSong;
  //   })
  // );

  // console.log("SongData: ", songData);
  // todo: once we have this song, we might as well save it to the db?
  // return songsForArtist;
}

async function getAlbumsFromSongs(songs) {
  return [];
}

async function getSongInfo(songId) {
  let song = await db.songs.getSong(songId);
  console.log("song from db: ", song);
  if (song.id) return song;

  const songInformation = await geniusAPI.song(songId, { fetchLyrics: true });

  // TODO: standardize what this function returns. JSDOC?
  let returnStructure = {
    genius_id: songInformation.id,
    title: songInformation.title,
    artist: songInformation.artist,
    album: songInformation.album,
    lyrics: songInformation.lyrics,
  };

  return songInformation;
}

module.exports = {
  getAllSongsForArtist,
  getSongInfo,
};
