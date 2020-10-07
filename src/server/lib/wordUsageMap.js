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
  // sort by count in descending order
  var finalWordsArray = [];
  finalWordsArray = Object.keys(wordsMap).map((key) => {
    return {
      name: key,
      total: wordsMap[key],
    };
  });

  finalWordsArray.sort((a, b) => {
    return b.total - a.total;
  });

  return finalWordsArray;
};

const buildWordCountResult = (lyrics) => {
  const wordsArray = lyrics.split(/\s+/);
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
  constructCountTable: constructWordUsageTable
};