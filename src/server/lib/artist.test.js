const { getArtistByName } = require("./artist");

fetch.dontMock();

describe("Arists", () => {
  test("get an artist's id from their name", async () => {
    // function createAMockedResponseStructure(responseData) {
    //   let mockedData = JSON.stringify({
    //     meta: { status: 200 },
    //     response: responseData,
    //   });

    //   return mockedData;
    // }

    // let testData = createAMockedResponseStructure({
    //   song: { id: 1, title: "Song 1", album: { id: 1 } },
    // });

    // fetch.mockResponse(testData);

    const artist = await getArtistByName("Aesop rock");
    expect(artist.id).toBe(178);
  });
});
