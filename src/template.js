import { GENERAL_LOOKUP } from '@/lookups';

export default (gameId) => ({
  lastUpdated: null,
  weaponId: null,
  equipList: Array(GENERAL_LOOKUP[gameId].NUM_MAINSTATS).fill().map(() => ({
    ...(gameId === 'wuthering-waves' && { cost: null }),
    setId: null,
    mainStatId: null,
    mainStatValue: null,
    subStatList: Array(GENERAL_LOOKUP[gameId].NUM_SUBSTATS).fill().map(() => ({
      subStatId: null,
      subStatValue: null
    }))
  })),
});
