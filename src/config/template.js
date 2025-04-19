import { INFO_DATA } from "@data";

const skillMapTemplate = {
  gi: { "001": 10, "002": 10, "003": 10 },
  hsr: { "001": 6, "002": 10, "003": 10, "004": 10, "101": 1, "102": 1, "103": 1, "201": 1, "202": 1, "203": 1, "204": 1, "205": 1, "206": 1, "207": 1, "208": 1, "209": 1, "210": 1 },
  ww: { "001": 10, "002": 10, "003": 10, "004": 10, "005": 10, "101": 1, "102": 1, "201": 1, "202": 1, "203": 1, "204": 1, "205": 1, "206": 1, "207": 1, "208": 1 },
  zzz: { "001": 12, "002": 12, "003": 12, "004": 12, "005": 12, "101": 1, "102": 1, "103": 1, "104": 1, "105": 1, "106": 1 },
};

export default (gameId) => ({
  isStar: false,
  level: INFO_DATA[gameId].MAX_LEVEL,
  rank: 0,
  skillMap: { ...skillMapTemplate[gameId] },
  weaponId: null,
  weaponLevel: null,
  weaponRank: null,
  equipList: Array(INFO_DATA[gameId].MAIN_LEN).fill().map(() => ({
    setId: null,
    stat: null,
    statList: Array(INFO_DATA[gameId].SUB_LEN).fill().map(() => ({
      stat: null,
      value: null
    }))
  })),
});
