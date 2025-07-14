import { INFO_DATA } from "@data";

export default (gameId) => ({
  isStar: false,
  weaponId: null,
  equipList: Array(INFO_DATA[gameId].MAIN_LEN).fill().map(() => ({
    stat: null,
    statList: Array(INFO_DATA[gameId].SUB_LEN).fill().map(() => ({
      stat: null,
      value: null
    }))
  })),
});
