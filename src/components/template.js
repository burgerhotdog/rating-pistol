export default (gameId) => {
  const equipLength = (gameId === "gi" || gameId === "ww") ? 5 : 6;

  return {
    isStar: false,

    level: "1",
    rank: "0",
    skillMap: {
      basic: "1",
      skill: "1",
      ult: "1",
      ...(gameId === "hsr"
        ? {
          talent: "1",
          A2: "0",
          A4: "0",
          A6: "0",
          m1a: "0",
          m1b: "0",
          m1c: "0",
          m1d: "0",
          m1e: "0",
          m2a: "0",
          m2b: "0",
          m2c: "0",
          m3a: "0",
          m3b: "0",
        }
        : {}),
      ...(gameId === "ww"
        ? { forte: "1", intro: "1" }
        : {}),
      ...(gameId === "zzz"
        ? { dodge: "1", assist: "1", core: "1" }
        : {}),
    },

    weaponId: null,
    weaponLevel: null,
    weaponRank: null,

    equipList: Array(equipLength)
      .fill()
      .map(() => ({
        setId: null,
        key: null,
        statMap: {
          0: { key: null, value: null },
          1: { key: null, value: null },
          2: { key: null, value: null },
          3: { key: null, value: null },
          ...(gameId === "ww"
            ? { 4: { key: null, value: null } }
            : {}),
        },
      })),
  };
};
