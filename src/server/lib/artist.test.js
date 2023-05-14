const { getArtistByName } = require("./artist");
const { artists } = require("../lib/utils/db");

jest.mock("../lib/utils/db");

// Todo: Consider moving this somewhere common.
function createAMockedResponseStructure(responseData) {
  let mockedData = JSON.stringify({
    meta: { status: 200 },
    response: responseData,
  });

  return mockedData;
}

describe("Artists", () => {
  test("get an artist's id from their name when I have it in the database", async () => {
    // Let's pretend that the artist exists in the database.
    artists.getArtists.mockResolvedValue({ id: 178, name: "Aesop rock" });

    const artist = await getArtistByName("Aesop rock");

    expect(artist.name).toBe("Aesop rock");
    expect(artist.genius_id).toBe(178);
  });

  test("get an artist's id from their name when I don't have it in the database", async () => {
    // This is a recreation of the important block of code when scraping this.
    let testData = `<html><meta name="newrelic-resource-path" content="/artists/178"></meta><html/>`;

    let artistTestData = createAMockedResponseStructure({
      artist: { id: 178, title: "Aesop Rock" },
    });

    fetch.mockResponses(testData, artistTestData);

    // Simulate the situation where the artist doesn't exist in the database.
    artists.getArtists.mockResolvedValue(undefined);
    artists.saveArtist.mockResolvedValue(undefined);

    const artist = await getArtistByName("Aesop rock");
    expect(artist.genius_id).toBe(178);
  });
});
