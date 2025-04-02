import { DATA } from "./importData";

export default (gameId, setBonuses) => {
  const { SET_DATA } = DATA[gameId];
  
  return Object.entries(setBonuses)
    .sort(([setIdA, numBonusA], [setIdB, numBonusB]) => {
      // Step 1: Sort by numBonus in descending order
      if (numBonusB !== numBonusA) {
        return numBonusB - numBonusA;
      }
      
      // Step 2: If numBonus is the same, sort by setId lexicographically (ascending)
      if (setIdA < setIdB) return -1;
      if (setIdA > setIdB) return 1;

      return 0;
    })
    .sort(([setIdA, numBonusA], [setIdB, numBonusB]) => {
      // Step 3: For "hsr" gameId, move Planar type entries to the back
      if (gameId === "hsr") {
        const isPlanarA = SET_DATA[setIdA]?.type === "Planar";
        const isPlanarB = SET_DATA[setIdB]?.type === "Planar";

        // If one is Planar and the other is not, move Planar to the back
        if (isPlanarA && !isPlanarB) return 1;
        if (!isPlanarA && isPlanarB) return -1;
      }

      return 0;
    });
};
