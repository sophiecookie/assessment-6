const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  // CODE HERE
  test("return an array", () => {
    const result = shuffle([1, 2, 3]);
    expect(Array.isArray(result)).toBe(true);
  });

  test("return an array of the same length as the argument", () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    expect(result).toHaveLength(inputArray.length);
  });

  test("contain all the same items as the input array", () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle(inputArray);
    inputArray.forEach((item) => {
      expect(result).toContain(item);
    });
  });

  test("shuffle the items in the array", () => {
    const inputArray = [1, 2, 3, 4, 5];
    const result = shuffle([...inputArray]); 
    expect(result).not.toEqual(inputArray); 
  });

});
