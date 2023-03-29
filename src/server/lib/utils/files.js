const fs = require("fs");

module.exports.writeFile = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data), "utf8", (err) => {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.", filename);
  });
};

module.exports.readFile = (filename) => {
  try {
    return fs.readFileSync(filename, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.info(`File ${filename} was not found.`);
    } else {
      throw err;
    }
  }
};
