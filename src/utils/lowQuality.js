import { STAT_DATA } from '@data';

const HOYO_QUALITY = {
  gi: 0.7,
  hsr: 0.8,
  zzz: 1,
};

const WW_VAL = {
  _HP: 320,
  _ATK: 30,
  _DEF: 40,
  HP: 6.4,
  ATK: 6.4,
  DEF: 8.1,
  ER: 6.8,
  BA: 6.4,
  HA: 6.4,
  RS: 6.4,
  RL: 6.4,
  CR: 6.3,
  CD: 12.6,
};

const oneIn = (n) => {
  return !Math.floor(Math.random() * n);
};

export default (gameId, stat) => {
  if (gameId !== 'ww') return HOYO_QUALITY[gameId];

  const { subValue } = STAT_DATA[gameId][stat]
  return WW_VAL[stat] / subValue;
};
