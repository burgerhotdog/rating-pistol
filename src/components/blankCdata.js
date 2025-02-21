const blankCdata = (gameType) => {
  const config = {
    GI: { substatsLength: 5, substatsEntries: 4, prefill: ["FLAT_HP", "FLAT_ATK"], multiSet: false },
    HSR: { substatsLength: 6, substatsEntries: 4, prefill: ["FLAT_HP", "FLAT_ATK"], multiSet: true },
    ZZZ: { substatsLength: 6, substatsEntries: 4, prefill: ["FLAT_HP", "FLAT_ATK", "FLAT_DEF"], multiSet: true },
    WW: { substatsLength: 5, substatsEntries: 5, prefill: [], multiSet: false },
  };

  const { substatsLength, substatsEntries, prefill, multiSet } = config[gameType] || config.GI;

  const mainstats = Array(substatsLength).fill("").map((_, i) => prefill[i] || "");

  const substats = Array.from({ length: substatsLength }, () =>
    Object.fromEntries([...Array(substatsEntries)].map((_, i) => [i, ["", ""]]))
  );

  return {
    weapon: "",
    set1: "",
    ...(multiSet ? { set2: "" } : {}),
    mainstats,
    substats,
  };
};

export default blankCdata;
