import { SETS } from "@data";

const getSetBonuses = (gameId, equipList) => {
  const setCounts = {};
  equipList.forEach(({ setId }) => {
    if (setId) {
      setCounts[setId] ??= 0;
      setCounts[setId]++;
    }
  });

  const bonuses = {};
  const sets = Object.entries(setCounts).sort((a, b) => b[1] - a[1]);

  const fullBonus = gameId === "ww" ? 5 : 4;
  const halfBonus = 2;

  sets.forEach(([set, count]) => {
    if (count >= fullBonus) bonuses[set] = fullBonus;
    else if (count >= halfBonus) bonuses[set] = halfBonus;
  });

  return Object.entries(bonuses)
    .sort(([a, a_bonus], [b, b_bonus]) => {
      // Sort by numBonus in descending order
      if (b_bonus !== a_bonus) return b_bonus - a_bonus;
      
      // If numBonus is the same, sort by setId ascending
      return Number(a) - Number(b);
    })
    .sort(([a], [b]) => {
      if (gameId !== "hsr") return 0;

      // Move hsr planar bonus to the back
      if (SETS.hsr[a].type === "Planar") return 1;
      if (SETS.hsr[b].type === "Planar") return -1;
      return 0;
    });
};

export default getSetBonuses;
