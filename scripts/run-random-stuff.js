const { getSongInfo } = require("../src/server/lib/songs.js");

async function test() {
  let result = await getSongInfo(16775);
  console.log({ result });
}

test();
