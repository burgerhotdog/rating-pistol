const amIException = (id) => {
  if (id === "1301") return true; // gallagher
  if (id === "1001") return true; // march 7th preservation
  return false;
};

const exceptionConfig = {
  "1301": {
    m1a: "m1a",
    m1b: "m1b",
    m1c: "m1c",
    m1d: "m1d",
    m1e: "m2a",
    m2a: "m3b",
    m2b: "m3a",
    m2c: "m1e",
    m3a: "m2b",
    m3b: "m2c",
  },
  "1001": {
    m1a: "m1a",
    m1b: "m1b",
    m1c: "m1c",
    m1d: "m1d",
    m1e: "m1e",
    m2a: "m2a",
    m2b: "m2b",
    m2c: "m2c",
    m3a: "m3a",
    m3b: "m3b",
  },
};

export { amIException, exceptionConfig };
