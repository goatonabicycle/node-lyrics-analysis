// __mocks__/GeniusAPI.js

class GeniusAPI {
  constructor() {
    this.accessToken = "MOCK_ACCESS_TOKEN";
  }

  async song(id, options = {}) {
    return {
      id,
      title: "Mock Song Title",
      lyrics: "Mock song lyrics",
      ...options,
    };
  }

  async album(id, options = {}) {
    return {
      id,
      title: "Mock Album Title",
      tracklist: [
        { id: 1, title: "Mock Song Title 1" },
        { id: 2, title: "Mock Song Title 2" },
      ],
      ...options,
    };
  }

  async getAlbumLyrics(album) {
    return album.tracklist.map((song) => ({
      id: song.id,
      title: song.title,
      lyrics: "Mock song lyrics",
    }));
  }

  async artist(id, options = {}) {
    return {
      id,
      name: "Mock Artist Name",
      ...options,
    };
  }

  async songsByArtist(id, options = {}) {
    return [
      { id: 1, title: "Mock Song Title 1" },
      { id: 2, title: "Mock Song Title 2" },
    ];
  }

  async search(query) {
    return [
      { id: 1, title: "Mock Song Title 1" },
      { id: 2, title: "Mock Song Title 2" },
    ];
  }
}

module.exports = GeniusAPI;
