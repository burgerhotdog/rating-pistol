const blankCdata = (gameType) => {
  const config = {
    GI: { substatsLength: 5, substatsEntries: 4, prefill: ["FIGHT_PROP_HP", "FIGHT_PROP_ATTACK"], multiSet: false },
    HSR: { substatsLength: 6, substatsEntries: 4, prefill: ["HPDelta", "AttackDelta"], multiSet: true },
    ZZZ: { substatsLength: 6, substatsEntries: 4, prefill: ["HP", "ATK", "DEF"], multiSet: true },
    WW: { substatsLength: 5, substatsEntries: 5, prefill: [], multiSet: false },
  };

  const { substatsLength, substatsEntries, prefill, multiSet } = config[gameType] || config.GI;

  const mainstats = Array(substatsLength).fill("").map((_, i) => prefill[i] || "");

  const substats = Array.from({ length: substatsLength }, () =>
    Object.fromEntries([...Array(substatsEntries)].map((_, i) => [i, ["", ""]]))
  );

  return {
    weapon: "",
    ...(multiSet ? { set1: "", set2: "" } : { set: "" }),
    mainstats,
    substats,
  };
};

export default blankCdata;
