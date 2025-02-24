const dataTemplate = (gameType) => {
  const config = {
    GI: { numOfMainstats: 5, numOfSubstats: 4, multiSet: false },
    HSR: { numOfMainstats: 6, numOfSubstats: 4, multiSet: true },
    WW: { numOfMainstats: 5, numOfSubstats: 5, multiSet: false },
    ZZZ: { numOfMainstats: 6, numOfSubstats: 4, multiSet: true },
  };

  const { numOfMainstats, numOfSubstats, multiSet } = config[gameType] || config.GI;

  return {
    weapon: "",
    set1: "",
    ...(multiSet ? { set2: "" } : {}),
    mainstats: Array(numOfMainstats).fill(""),
    substats: Array.from({ length: numOfMainstats }, () =>
      Object.fromEntries(Array.from({ length: numOfSubstats }, (_, i) => [i, ["", ""]]))
    ),
  };
};

export default dataTemplate;
