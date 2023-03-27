const createWordMap = (wordsArray) => {
  var wordsMap = {};
  wordsArray.forEach((key) => {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;
};

const sortByCount = (wordsMap) => {
  const finalWordsArray = Object.keys(wordsMap).map((key) => {
    return {
      name: key,
      total: wordsMap[key],
    };
  });

  finalWordsArray.sort((a, b) => {
    if (b.total === a.total) {
      return a.name.localeCompare(b.name); // sort by name if count is the same
    }
    return b.total - a.total; // sort by count in descending order
  });

  return finalWordsArray;
};

function cleanText(text) {
  const denotationsRegex = /(\[.*?\]|\(.*?\)|<\/?[^>]+(>|$))/g;
  const punctuationRegex = /[^\w\s']/g; // include the apostrophe character

  let cleanedText = text
    .toLowerCase()
    .replace(denotationsRegex, "")
    .replace(punctuationRegex, "");

  cleanedText = cleanedText
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleanedText;
}

const buildWordCountResult = (lyrics) => {
  const wordsArray = cleanText(lyrics).split(/\s+/);
  const wordsMap = createWordMap(wordsArray);
  const result = sortByCount(wordsMap);
  return result;
};

const constructWordUsageTable = (lyricsForThisSong) => {
  if (lyricsForThisSong.length <= 0) return [];

  const wordUsageMap = buildWordCountResult(lyricsForThisSong);
  return wordUsageMap;
};

module.exports = {
  constructWordUsageTable,
};
