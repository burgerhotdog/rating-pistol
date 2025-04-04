export default (gameId) => {
  const equipLength = (gameId === "gi" || gameId === "ww") ? 5 : 6;

  return {
    isStar: false,
    level: 1,
    rank: 0,
    skillMap: {
      "001": 1,
      "002": 1,
      "003": 1,
      ...(gameId === "hsr"
        ? {
          "004": 1,
          "007": 1,
          "101": 0,
          "102": 0,
          "103": 0,
          "201": 0,
          "202": 0,
          "203": 0,
          "204": 0,
          "205": 0,
          "206": 0,
          "207": 0,
          "208": 0,
          "209": 0,
          "210": 0,
        }
        : {}),
      ...(gameId === "ww"
        ? {
          "004": 1,
          "005": 1,
          "101": 0,
          "102": 0,
          "201": 0,
          "202": 0,
          "203": 0,
          "204": 0,
          "205": 0,
          "206": 0,
          "207": 0,
          "208": 0,
        }
        : {}),
      ...(gameId === "zzz"
        ? { "004": 1, "005": 1, "006": 1 }
        : {}),
    },

    weaponId: null,
    weaponLevel: null,
    weaponRank: null,

    equipList: Array(equipLength)
      .fill()
      .map(() => ({
        setId: null,
        stat: null,
        statMap: {
          0: { stat: null, value: null },
          1: { stat: null, value: null },
          2: { stat: null, value: null },
          3: { stat: null, value: null },
          ...(gameId === "ww"
            ? { 4: { stat: null, value: null } }
            : {}),
        },
      })),
  };
};
