const { getArtistByName } = require("./artist");

// Todo: Consider moving this somewhere common.
function createAMockedResponseStructure(responseData) {
  let mockedData = JSON.stringify({
    meta: { status: 200 },
    response: responseData,
  });

  return mockedData;
}

describe("Artists", () => {
  test("get an artist's id from their name", async () => {
    let testData = `<html><meta name="newrelic-resource-path" content="/artists/178"></meta><html/>`;

    let artistTestData = createAMockedResponseStructure({
      artist: { id: 178, title: "Aesop Rock" },
    });

    fetch.mockResponses(testData, artistTestData);

    const artist = await getArtistByName("Aesop rock");
    expect(artist.id).toBe(178);
  });
});
