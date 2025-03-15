export default (gameId) => {
  const equipLength = (gameId === "gi" || gameId === "ww") ? 5 : 6;

  return {
    isStar: false,

    level: "1",
    rank: "0",
    skillMap: {
      basic: 1,
      skill: 1,
      ult: 1,
      ...(gameId === "hsr"
        ? { talent: 1 }
        : {}),
      ...(gameId === "ww"
        ? { forte: 1, intro: 1 }
        : {}),
      ...(gameId === "zzz"
        ? { dodge: 1, assist: 1, core: 1 }
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
