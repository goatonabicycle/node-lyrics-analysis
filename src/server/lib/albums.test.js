const { getAlbumData } = require("./albums");
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

describe("Albums", () => {
  test("Albums from artist Id.", async () => {});
  test("Album from song id.", async () => {});
});
