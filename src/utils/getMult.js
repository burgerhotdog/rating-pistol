const MULTS = {
  gi: [1, 0.9, 0.8, 0.7],
  hsr: [1, 0.9, 0.8],
  ww: [35 / 35, 33 / 35, 31 / 35, 29 / 35, 27 / 35, 25 / 35, 23 / 35, 21 / 35],
  zzz: [1],
};

const getMult = (gameId) => {
  const mults = MULTS[gameId];
  const random = Math.floor(Math.random() * mults.length);
  return mults[random];
};

export default getMult;
