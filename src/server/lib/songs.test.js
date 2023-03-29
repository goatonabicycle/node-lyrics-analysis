const { getAllSongsForArtist } = require("./songs");

function createAMockedSongStructure(songData) {
  let mockedData = JSON.stringify({
    meta: { status: 200 },
    response: {
      songs: songData,
    },
  });

  return mockedData;
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
      let testData = createAMockedSongStructure([
        { id: "1", title: "Song 1" },
        { id: "2", title: "Song 2" },
      ]);

      fetch.mockResponse(testData);

      const artistId = 111;
      const artistName = "This is Mocked so it's cool!";
      const result = await getAllSongsForArtist(artistName, artistId);

      expect(result.songData.length).toBeGreaterThan(0);
      expect(result.songData[0].title).toBe("Song 1");
      expect(result.songData[1].title).toBe("Song 2");
    });

    test("When there are more than 20 songs, we get songs from the next page.", async () => {
      let songData = [];

      for (let i = 1; i <= 35; i++) {
        songData.push({ id: i, title: `Song ${i}` });
      }

      const songSet1 = songData.slice(0, 20);
      const songSet2 = songData.slice(20);

      let mockedData1 = createAMockedSongStructure(songSet1);
      let mockedData2 = createAMockedSongStructure(songSet2);

      fetch.mockResponses(
        [mockedData1, { status: 200 }],
        [mockedData2, { status: 200 }]
      );

      const artistId = 111;
      const artistName = "This is Mocked so it's cool!";
      const result = await getAllSongsForArtist(artistName, artistId);

      expect(result.songData.length).toBeGreaterThan(0);
      expect(result.songData[0].title).toBe("Song 1");
      expect(result.songData[30].title).toBe("Song 31");
    });
  });
});
