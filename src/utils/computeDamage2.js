import { RATING, CHARACTERS, WEAPONS } from "@/data";
import { mergeStatMaps, computeTotalStat, compileStatMap } from "@/utils";

export function computeDamage2(gameId, characterId, build, criteria, team) {
  const { computeBase, computeBonuses, computeReductions } = RATING[gameId];
  const statMap = compileStatMap(gameId, characterId, build, team, "combat");

  const baseDmg = computeBase(statMap, criteria);
  const bonuses = computeBonuses(statMap, criteria);
  const reductions = computeReductions(statMap, criteria)
  // console.log(statMap, `baseDmg: ${baseDmg}`, `bonuses: ${bonuses}`, `reductions: ${reductions}`);
  return baseDmg * bonuses * reductions;
}
