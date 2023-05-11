const { getAllSongsForArtist, getSongInfo } = require("./songs");

function createAMockedResponseStructure(responseData) {
  let mockedData = JSON.stringify({
    meta: { status: 200 },
    response: responseData,
  });

  return mockedData;
}

describe("songs", () => {
  describe("getAllSongsForArtist", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });

    afterEach(() => {
      fetch.resetMocks();
    });

    test("Not providing info returns nothing", async () => {
      const result = await getAllSongsForArtist();
      expect(result).toBe(undefined);
    });

    test("When there are more than 50 songs, we get songs from the next page.", async () => {
      let songData = [];

      for (let i = 1; i <= 55; i++) {
        songData.push({ id: i, title: `Song ${i}` });
      }

      const songSet1 = songData.slice(0, 50);
      const songSet2 = songData.slice(50);

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

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toBe("Song 1");
      expect(result[30].title).toBe("Song 31");
    });

    test("A mocked endpoint returns an array of songs", async () => {
      let testData = createAMockedResponseStructure({
        songs: [
          { id: 1, title: "Song 1" },
          { id: 2, title: "Song 2" },
        ],
      });

      fetch.mockResponseOnce(testData);

      const artistId = 111;
      const artistName = "This is Mocked so it's cool!";
      const result = await getAllSongsForArtist(artistName, artistId);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].genius_id).toBe(1);
      expect(result[1].title).toBe("Song 2");
    });
  });

  describe("getSongById", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });
    test("Not providing info returns nothing", async () => {});

    test("Song details are accessible", async () => {
      let songId = 99999;
      let albumId = 88888;
      let testData = createAMockedResponseStructure({
        song: {
          id: songId,
          url: "Some url",
          title: "Song 1",
          album: { id: albumId },
        },
      });

      fetch.mockResponse(testData);

      let songInfo = await getSongInfo(songId);

      expect(songInfo.id).toBe(songId);
      expect(songInfo.album.id).toBe(albumId);
    });

    test("Song lyrics are accessible", async () => {});
  });

  test("Albums can be returned for a specific artist.", async () => {});
  test("Albums have their correct tracklistings", async () => {});
});
