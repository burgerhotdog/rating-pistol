import { INFO_DATA } from '@data';

export default (gameId) => ({
  isStar: false,
  weaponId: null,
  equipList: Array(INFO_DATA[gameId].NUM_MAINSTATS).fill().map(() => ({
    stat: null,
    statList: Array(INFO_DATA[gameId].NUM_SUBSTATS).fill().map(() => ({
      stat: null,
      value: null
    }))
  })),
});
