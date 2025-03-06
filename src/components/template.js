const templateInfo = (gameId) => {
  return {
    characterLevel: "",
    characterRank: "",

    weapon: "",
    weaponLevel: "",
    weaponRank: "",

    set: [{ id: "", bonus: "" }, { id: "", bonus: "" }],
    setExtra: { id: "", bonus: "" },

    skills: {
      basic: "",
      skill: "",
      ult: "",
      ...(gameId === "HSR" ? { talent: "" } : {}),
      ...(gameId === "WW" ? { forte: "", intro: "" } : {}),
      ...(gameId === "ZZZ" ? { dodge: "", assist: "", core: "" } : {}),
    },
  };
};

const templateGear = (gameId) => {
  return {
    mainstat: "",
    0: ["", ""],
    1: ["", ""],
    2: ["", ""],
    3: ["", ""],
    ...( gameId === "WW" ? { 4: ["", ""]} : {}),
  };
};

export { templateInfo, templateGear };
