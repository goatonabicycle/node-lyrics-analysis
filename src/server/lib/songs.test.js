const { getAllSongsForArtist, getSongInfo } = require("./songs");
const { songs } = require("../lib/utils/db");

jest.mock("../lib/utils/db");

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

    test("Not providing info returns nothing", async () => {
      const result = await getAllSongsForArtist();
      expect(result).toBe(undefined);
    });

    test("Using the Genius API, when there are more than 50 songs, we get songs from the next page.", async () => {
      // let songData = [];
      // for (let i = 1; i <= 55; i++) {
      //   songData.push({ id: i, title: `Song ${i}` });
      // }
      // const songSet1 = songData.slice(0, 50);
      // const songSet2 = songData.slice(50);
      // let mockedData1 = createAMockedResponseStructure({
      //   songs: songSet1,
      // });
      // let mockedData2 = createAMockedResponseStructure({
      //   songs: songSet2,
      // });
      // songs.getSong.mockResolvedValue(undefined);
      // fetch.mockResponses(
      //   [mockedData1, { status: 200 }],
      //   [mockedData2, { status: 200 }]
      // );
      // const artistId = 111;
      // const artistName = "This is Mocked so it's cool!";
      // const result = await getAllSongsForArtist(artistName, artistId);
      // expect(result.length).toBeGreaterThan(0);
      // expect(result[0].title).toBe("Song 1");
      // expect(result[30].title).toBe("Song 31");
    });

    test("Mocked data returns an array of songs", async () => {
      songs.getSongsByArtist.mockResolvedValue([
        { genius_id: 1, title: "Song 1" },
        { genius_id: 2, title: "Song 2" },
      ]);

      const artistId = 111;
      const artistName = "This is Mocked so it's cool!";
      const result = await getAllSongsForArtist(artistName, artistId);

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].genius_id).toBe(1);
      expect(result[1].title).toBe("Song 2");
    });

    // test("A mocked endpoint returns an array of songs", async () => {
    //   let testData = createAMockedResponseStructure({
    //     songs: [
    //       { id: 1, title: "Song 1" },
    //       { id: 2, title: "Song 2" },
    //     ],
    //   });

    //   fetch.mockResponseOnce(testData);

    //   const artistId = 111;
    //   const artistName = "This is Mocked so it's cool!";
    //   const result = await getAllSongsForArtist(artistName, artistId);

    //   expect(result.length).toBeGreaterThan(0);
    //   expect(result[0].genius_id).toBe(1);
    //   expect(result[1].title).toBe("Song 2");
    // });
  });

  describe("getSongById", () => {
    beforeEach(() => {
      fetch.resetMocks();
    });
    test("Not providing info returns nothing", async () => {});

    test("Song details are accessible", async () => {
      // let songId = 99999;
      // let albumId = 88888;
      // // If this comes from the API.
      // let testData = createAMockedResponseStructure({
      //   song: {
      //     id: songId,
      //     url: "Some url",
      //     title: "Song 1",
      //     album: { id: albumId },
      //   },
      // });
      // fetch.mockResponse(testData);
      // // If this comes from the DB.
      // songs.getSong.mockResolvedValue({
      //   id: songId,
      //   genius_id: 5,
      //   albumId,
      //   artistId: 555,
      //   lyrics: "Some lyrics",
      // });
      // let songInfo = await getSongInfo(songId);
      // expect(songInfo.id).toBe(songId);
      // expect(songInfo.albumId).toBe(albumId);
    });

    test("Song lyrics are accessible", async () => {});
  });

  test("Albums can be returned for a specific artist.", async () => {});
  test("Albums have their correct tracklistings", async () => {});
});
