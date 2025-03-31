const addSubstatWeights = {
  gi: [
    ["_HP", 6],
    ["_ATK", 6],
    ["_DEF", 6],
    ["HP", 4],
    ["ATK", 4],
    ["DEF", 4],
    ["EM", 4],
    ["ER", 4],
    ["CR", 3],
    ["CD", 3],
  ],
  hsr: [
    ["_HP", 10],
    ["_ATK", 10],
    ["_DEF", 10],
    ["HP", 10],
    ["ATK", 10],
    ["DEF", 10],
    ["CR", 6],
    ["CD", 6],
    ["EHR", 8],
    ["SPD", 4],
    ["BE", 8],
    ["RES", 8],
  ],
  ww: [
    ["_HP", 10],
    ["_ATK", 10],
    ["_DEF", 10],
    ["HP", 10],
    ["ATK", 10],
    ["DEF", 10],
    ["CR", 6],
    ["CD", 6],
    ["ER", 8],
    ["BA", 8],
    ["HA", 8],
    ["RS", 8],
    ["RL", 8],
  ],
  zzz: [
    ["_HP", 10],
    ["_ATK", 10],
    ["_DEF", 10],
    ["HP", 10],
    ["ATK", 10],
    ["DEF", 10],
    ["CR", 6],
    ["CD", 6],
    ["AP", 8],
    ["PEN", 8],
  ],
};

const getRandValueMultiplier = (gameId) => {
  if (gameId === "zzz") return 1;
  if (gameId === "ww") {
    const hiLo = [35, 33, 31, 29, 27, 25, 23, 21];
    const randIndex = Math.floor(Math.random() * 8);
    return hiLo[randIndex] / 35;
  }
  const hiLo = [1, 0.9, 0.8, 0.7];
  const numTypes = gameId === "gi" ? 4 : 3;
  const randIndex = Math.floor(Math.random() * numTypes);
  return hiLo[randIndex];
};

export { addSubstatWeights, getRandValueMultiplier };