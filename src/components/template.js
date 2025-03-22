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
          tech: "1",
          M0: "0",
          M1: "0",
          M2: "0",
          m0: "0",
          m1: "0",
          m2: "0",
          m3: "0",
          m4: "0",
          m5: "0",
          m6: "0",
          m7: "0",
          m8: "0",
          m9: "0",
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
