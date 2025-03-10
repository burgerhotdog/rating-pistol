export default (gameId) => {
  const equipLength = (gameId === "gi" || gameId === "ww") ? 5 : 6;

  return {
    isStar: false,

    level: null,
    rank: null,
    skillMap: {
      basic: null,
      skill: null,
      ult: null,
      ...(gameId === "hsr"
        ? { talent: null }
        : {}),
      ...(gameId === "ww"
        ? { forte: null, intro: null }
        : {}),
      ...(gameId === "zzz"
        ? { dodge: null, assist: null, core: null }
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
