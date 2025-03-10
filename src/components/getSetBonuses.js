export default (gameId, equipList) => {
  const setCounts = {};
  equipList.forEach(({ setId }) => {
    if (setId) {
      setCounts[setId] = (setCounts[setId] || 0) + 1;
    }
  });

  const bonuses = {};
  const sets = Object.entries(setCounts).sort((a, b) => b[1] - a[1]);

  sets.forEach(([set, count]) => {
    if (count >= (gameId === "ww" ? 5 : 4)) {
      bonuses[set] = (gameId === "ww" ? 5 : 4);
    } else if (count >= 2) {
      bonuses[set] = 2;
    }
  });

  return bonuses;
};
