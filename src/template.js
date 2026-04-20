import { MISC } from '@/data';

export default (gameId) => ({
  lastUpdated: null,
  weaponId: null,
  equipList: Array(MISC[gameId].NUM_MAINSTATS).fill().map(() => ({
    ...(gameId === 'wuthering-waves' && { cost: null }),
    setId: null,
    mainStatId: null,
    mainStatValue: null,
    subStatList: Array(MISC[gameId].NUM_SUBSTATS).fill().map(() => ({
      subStatId: null,
      subStatValue: null
    }))
  })),
});
