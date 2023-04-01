const fs = require("fs");
const path = require("path");

module.exports.writeFile = (filePath, data) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(data), "utf8", (err) => {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.", filePath);
  });
};

module.exports.readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.info(`File ${filePath} was not found.`);
    } else {
      throw err;
    }
  }
};
