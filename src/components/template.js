const templateInfo = (gameType) => {
  return {
    characterLevel: "",
    characterRank: "",

    weapon: "",
    weaponLevel: "",
    weaponRank: "",

    set: ["", ""],
    ...(gameType === "HSR" ? { setExtra: "" } : {}),
    ...(gameType === "ZZZ" ? { setExtra: "" } : {}),

    skills: {
      basic: "",
      skill: "",
      ult: "",
      ...(gameType === "HSR" ? { talent: "" } : {}),
      ...(gameType === "WW" ? { forte: "", intro: "" } : {}),
      ...(gameType === "ZZZ" ? { dodge: "", assist: "", core: "" } : {}),
    },
  };
};

const templateGear = (gameType) => {
  return {
    mainstat: "",
    0: ["", ""],
    1: ["", ""],
    2: ["", ""],
    3: ["", ""],
    ...( gameType === "WW" ? { 4: ["", ""]} : {}),
  };
};

export { templateInfo, templateGear };
