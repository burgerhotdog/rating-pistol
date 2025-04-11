import INFO from "@data/static/info";

const skillMapTemplate = {
  gi: { "001": 1, "002": 1, "003": 1 },
  hsr: { "001": 1, "002": 1, "003": 1, "004": 1, "101": 0, "102": 0, "103": 0, "201": 0, "202": 0, "203": 0, "204": 0, "205": 0, "206": 0, "207": 0, "208": 0, "209": 0, "210": 0 },
  ww: { "001": 1, "002": 1, "003": 1, "004": 1, "005": 1, "101": 0, "102": 0, "201": 0, "202": 0, "203": 0, "204": 0, "205": 0, "206": 0, "207": 0, "208": 0 },
  zzz: { "001": 1, "002": 1, "003": 1, "004": 1, "005": 1, "101": 0, "102": 0, "103": 0, "104": 0, "105": 0, "106": 0 },
};

export const statObjTemplate = { stat: null, value: null };

export const avatarTemplate = (gameId) => ({
  isStar: false,
  level: INFO[gameId].MAX_LEVEL,
  rank: 0,
  skillMap: { ...skillMapTemplate[gameId] },
  weaponId: null,
  weaponLevel: null,
  weaponRank: null,
  equipList: Array(INFO[gameId].MAIN_LEN)
    .fill()
    .map(() => ({
      setId: null,
      stat: null,
      statList: Array(INFO[gameId].SUB_LEN)
        .fill()
        .map(() => ({ ...statObjTemplate })),
    })),
});
