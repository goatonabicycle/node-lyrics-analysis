const { constructWordUsageTable } = require("./wordUsageMap");

describe("constructWordUsageTable", () => {
  test("returns an empty array for empty input", () => {
    expect(constructWordUsageTable("")).toEqual([]);
  });

  test("returns an array of objects sorted by count in descending order", () => {
    const lyrics =
      "Hey Jude, don't make it bad. Take a sad song and make it better.";
    const expected = [
      { name: "it", total: 2 },
      { name: "make", total: 2 },
      { name: "a", total: 1 },
      { name: "and", total: 1 },
      { name: "bad", total: 1 },
      { name: "better", total: 1 },
      { name: "don't", total: 1 },
      { name: "hey", total: 1 },
      { name: "jude", total: 1 },
      { name: "sad", total: 1 },
      { name: "song", total: 1 },
      { name: "take", total: 1 },
    ];
    expect(constructWordUsageTable(lyrics)).toEqual(expected);
  });

  test("ignores case when counting word occurrences", () => {
    const lyricsForThisSong = "One one two Three";
    const result = constructWordUsageTable(lyricsForThisSong);
    expect(result).toEqual([
      { name: "one", total: 2 },
      { name: "three", total: 1 },
      { name: "two", total: 1 },
    ]);
  });

  test("ignores punctuation when counting word occurrences", () => {
    const lyrics =
      "Roses are red, violets are blue. Sugar is sweet, and so are you.";
    const expected = [
      { name: "are", total: 3 },
      { name: "and", total: 1 },
      { name: "blue", total: 1 },
      { name: "is", total: 1 },
      { name: "red", total: 1 },
      { name: "roses", total: 1 },
      { name: "so", total: 1 },
      { name: "sugar", total: 1 },
      { name: "sweet", total: 1 },
      { name: "violets", total: 1 },
      { name: "you", total: 1 },
    ];
    expect(constructWordUsageTable(lyrics)).toEqual(expected);
  });

  test("handles repeated words correctly", () => {
    const lyrics = "I love you, you love me. We're a happy family.";
    const expected = [
      { name: "love", total: 2 },
      { name: "you", total: 2 },
      { name: "a", total: 1 },
      { name: "family", total: 1 },
      { name: "happy", total: 1 },
      { name: "i", total: 1 },
      { name: "me", total: 1 },
      { name: "we're", total: 1 },
    ];
    expect(constructWordUsageTable(lyrics)).toEqual(expected);
  });
});
