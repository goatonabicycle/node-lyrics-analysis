const { getAllSongsForArtist, getSongInfo } = require("./songs");

function createAMockedResponseStructure(responseData) {
  let mockedData = JSON.stringify({
    meta: { status: 200 },
    response: responseData,
  });

  return mockedData;
}

describe("songs", () => {
  beforeEach(() => {});

  describe("getAllSongsForArtist", () => {
    test("Not providing info returns nothing", async () => {
      const result = await getAllSongsForArtist();
      expect(result).toBe(undefined);
    });

    test("A mocked endpoint returns an array of songs", async () => {
      let testData = createAMockedResponseStructure({
        songs: [
          { id: 1, title: "Song 1" },
          { id: 2, title: "Song 2" },
        ],
      });

      fetch.mockResponse(testData);

      const artistId = 111;
      const artistName = "This is Mocked so it's cool!";
      const result = await getAllSongsForArtist(artistName, artistId);

      expect(result.songData.length).toBeGreaterThan(0);
      expect(result.songData[0].id).toBe(1);
      expect(result.songData[1].title).toBe("Song 2");
    });

    test("When there are more than 20 songs, we get songs from the next page.", async () => {
      let songData = [];

      for (let i = 1; i <= 35; i++) {
        songData.push({ id: i, title: `Song ${i}` });
      }

      const songSet1 = songData.slice(0, 20);
      const songSet2 = songData.slice(20);

      let mockedData1 = createAMockedResponseStructure({
        songs: songSet1,
      });
      let mockedData2 = createAMockedResponseStructure({
        songs: songSet2,
      });

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

  describe("getSongById", () => {
    test("Not providing info returns nothing", async () => {});

    test("Song details are accessible", async () => {
      //fetch.dontMockOnce();
      let testData = createAMockedResponseStructure({
        song: { id: 3617, title: "Song 1", album: { id: 256 } },
      });

      fetch.mockResponse(testData);

      let songId = 3617; // Daylight by Aesop Rock
      let songInfo = await getSongInfo(songId);
      expect(songInfo.id).toBe(songId);
      expect(songInfo.album.id).toBe(256);
    });
  });

  test("Albums can be returned for a specific artist.", async () => {});
  test("Albums have their correct tracklistings", async () => {});
});
