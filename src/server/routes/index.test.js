jest.mock("../api/mocks/mockedLyricistGeniusAPI");

const app = require("../app"); // replace with your Express application
const request = require("supertest");
const router = require("../routes/index"); // replace with your router

// Todo: Determine how best to test this.
describe("Route handling", () => {
  describe("GET /test", () => {
    it("responds with 200", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
    });

    it("renders index view with artist information", async () => {
      const response = await request(app).get("/");
      expect(response.text).toContain("Aesop Rock");
      expect(response.text).toContain("artistId");
    });
  });
});
