const { getAllSongsForArtist } = require("./songs");

function createAMockedSongResult(songData) {
  fetch.mockResponseOnce(
    JSON.stringify({
      meta: { status: 200 },
      response: {
        songs: songData,
      },
    })
  );
}

describe("songs", () => {
  describe("getAllSongsForArtist", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    test("Not providing info returns nothing", async () => {
      const result = await getAllSongsForArtist();
      expect(result).toBe(undefined);
    });

    test("A mocked endpoint returns an array of songs", async () => {
      createAMockedSongResult([
        { id: "1", title: "Song 1" },
        { id: "2", title: "Song 2" },
      ]);

      const artistId = 111;
      const artistName = "This is Mocked so it's cool!";
      const result = await getAllSongsForArtist(artistName, artistId);

      expect(result.songData.length).toBeGreaterThan(0);
      expect(result.songData[0].title).toBe("Song 1");
      expect(result.songData[1].title).toBe("Song 2");
    });
  });
});
