import { STATS } from '@/data';

export default (gameId) => ({
  lastUpdated: null,
  weaponId: null,
  equipList: Array(STATS[gameId].NUM_MAINSTATS).fill().map(() => ({
    ...(gameId === 'wuthering-waves' && { cost: null }),
    setId: null,
    mainStatId: null,
    mainStatValue: null,
    subStatList: Array(STATS[gameId].NUM_SUBSTATS).fill().map(() => ({
      subStatId: null,
      subStatValue: null
    }))
  })),
});
