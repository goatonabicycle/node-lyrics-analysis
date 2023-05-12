jest.mock("../api/mocks/mockedLyricistGeniusAPI");

const request = require("supertest");
const app = require("../app"); // require your Express application
const router = require("../routes/index"); // require your router

describe("Route handling", () => {
  describe("GET /test", () => {
    it("responds with 200", async () => {
      // const response = await request(app).get("/test");
      // expect(response.status).toBe(200);
    });

    it("renders index view with artist information", async () => {
      // const response = await request(app).get("/test");
      // expect(response.text).toContain("Aesop Rock");
      // expect(response.text).toContain("artistId");
    });
  });
});
