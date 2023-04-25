// This file originally came from: https://github.com/scf4/lyricist
// I've needed to make many alterations though.

const fetch = require("node-fetch");
const cheerio = require("cheerio");
var config = require("../config.json");

module.exports = class GeniusAPI {
  constructor() {
    const geniusAPIKey = config.GeniusAPIkey;
    this.accessToken = geniusAPIKey;
  }

  /*
  Main request function
  */

  async _request(path) {
    const url = `https://api.genius.com/${path}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    console.log("Calling Genius API... -> ", url);
    // Fetch result and parse it as JSON
    const body = await fetch(url, {
      headers,
    });
    const result = await body.json();

    // Handle errors
    if (result.error)
      throw new Error(`${result.error}: ${result.error_description}`);
    if (result.meta.status !== 200)
      throw new Error(`${result.meta.status}: ${result.meta.message}`);

    return result.response;
  }

  /*
  Get song by ID
  */

  async song(id, { fetchLyrics = false, textFormat = "dom" } = {}) {
    if (!id) throw new Error("No ID was provided to lyricist.song()");

    const path = `songs/${id}?text_format=${textFormat}`;
    const { song } = await this._request(path);

    const lyrics = fetchLyrics ? await this._scrapeLyrics(song.url) : null;

    return Object.assign(
      {
        lyrics,
      },
      song
    );
  }

  /*
  Get album by ID
  */

  async album(id, { fetchTracklist = false, textFormat = "dom" } = {}) {
    if (!id) throw new Error("No ID was provided to lyricist.album()");

    const path = `albums/${id}?text_format=${textFormat}`;
    const { album } = await this._request(path);

    const tracklist = fetchTracklist
      ? await this._scrapeTracklist(album.url)
      : null;

    return Object.assign(
      {
        tracklist,
      },
      album
    );
  }

  /*
  Get album lyrics by album object
  */

  async getAlbumLyrics(album) {
    const songsAndTheirLyrics = [];

    for (let i = 0; i < album.tracklist.length; i++) {
      let song = album.tracklist[i];

      if (song._type !== "song" || song.track_number === null) continue; // Only deal with songs. Not album art.

      const lyrics = await this.song(song.id, {
        fetchLyrics: true,
      });

      const songDetails = {
        trackNumber: song.track_number,
        id: song.id,
        title: song.title,
        lyrics: lyrics.lyrics,
      };

      songsAndTheirLyrics.push(songDetails);
    }

    return songsAndTheirLyrics;
  }

  /* Get artist by ID */

  async artist(id, { textFormat = "dom" } = {}) {
    if (!id) throw new Error("No ID was provided to lyricist.artist()");

    const path = `artists/${id}?text_format=${textFormat}`;
    const { artist } = await this._request(path);
    return artist;
  }

  /*
    Get artist by exact name (undocumented, likely to change)
    Potentially unreliable, use at own risk! ⚠️
  */

  async artistByName(name, opts) {
    const slug = this._geniusSlug(name);
    const id = await this._scrapeArtistPageForArtistID(slug);
    return await this.artist(id, opts);
  }

  /* Get artist songs */

  async songReferencesByArtist(
    id,
    { page = 1, perPage = 50, sort = "title" } = {}
  ) {
    if (!id) throw new Error("No ID was provided to lyricist.songsByArtist()");

    let allSongs = [];
    let currentPage = page;
    const maxPages = 50;
    let numPages = 0;

    while (numPages < maxPages) {
      const path = `artists/${id}/songs?per_page=${perPage}&page=${currentPage}&sort=${sort}`;
      const { songs } = await this._request(path);

      if (songs.length === 0) {
        break; // no more songs, exit the loop
      }
      allSongs = allSongs.concat(
        songs.map((song) => ({
          genius_id: song.id,
          title: song.title,
        }))
      );

      if (songs.length < perPage) {
        break; // we have less than a full page of songs
      }

      currentPage++;
      numPages++;

      console.log("allSongs", allSongs);
      console.log("songs.length", songs.length);
      console.log("numPages", numPages);
      console.log("currentPage", currentPage);
    }

    return allSongs;
  }

  /* Search (for songs) */

  async search(query) {
    if (!query) throw new Error("No query was provided to lyricist.search()");

    const path = `search?q=${query}`;
    const response = await this._request(path);

    return response.hits.map((hit) => hit.result);
  }

  /* Scrape tracklist */

  async _scrapeTracklist(url) {
    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);
    const json = $('meta[itemprop="page_data"]').attr("content");
    const parsed = JSON.parse(json);
    const songs = parsed.album_appearances;
    return songs.map(({ song, track_number }) =>
      Object.assign({ track_number }, song)
    );
  }

  /* Scrape song lyrics */

  async _scrapeLyrics(url) {
    const response = await fetch(url);
    const text = await response.text();
    const $ = cheerio.load(text);
    let lyrics = $(".lyrics").text();
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    return lyrics.trim();
  }

  /* Get slug from name/title */

  _geniusSlug(string) {
    // Probably not 100% accurate yet
    // Currently only used by undocumented artistByName function
    const slug = string
      .trim()
      .replace(/\s+/g, "-")
      .replace("'", "")
      .replace("&", "and")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    // Uppercase first letter
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }

  /* Scrape artist page to retrieve artist ID */

  async _scrapeArtistPageForArtistID(slug) {
    const url = `https://genius.com/artists/${slug}`;
    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);
    const id = $('meta[name="newrelic-resource-path"]')
      .attr("content")
      .split("/")
      .pop();
    return id;
  }
};
