import { INFO_DATA } from '@data';

export default (gameId) => ({
  lastUpdated: null,
  weaponId: null,
  equipList: Array(INFO_DATA[gameId].NUM_MAINSTATS).fill().map(() => ({
    ...(gameId === 'wuthering-waves' && { cost: null }),
    setId: null,
    mainStatId: null,
    subStatList: Array(INFO_DATA[gameId].NUM_SUBSTATS).fill().map(() => ({
      subStatId: null,
      value: null
    }))
  })),
});
