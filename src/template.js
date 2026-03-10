import { ALL_GENERAL_LOOKUP } from '@/lookups';

export default (gameId) => ({
  lastUpdated: null,
  weaponId: null,
  equipList: Array(ALL_GENERAL_LOOKUP[gameId].NUM_MAINSTATS).fill().map(() => ({
    ...(gameId === 'wuthering-waves' && { cost: null }),
    setId: null,
    mainStatId: null,
    subStatList: Array(ALL_GENERAL_LOOKUP[gameId].NUM_SUBSTATS).fill().map(() => ({
      subStatId: null,
      value: null
    }))
  })),
});
