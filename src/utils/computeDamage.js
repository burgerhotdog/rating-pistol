import { RATING, CHARACTERS, WEAPONS } from "@/data";
import { mergeStatMaps, computeTotalStat, compileStatMap } from "@/utils";

export function computeDamage(gameId, characterId, build, criteria, team) {
  const { computeBase, computeBonuses, computeReductions } = RATING[gameId];
  const statMap = compileStatMap(gameId, characterId, build, team, "combat");

  const baseDmg = computeBase(statMap, criteria);
  const bonuses = computeBonuses(statMap, criteria);
  const reductions = computeReductions(statMap, criteria);
  return baseDmg * bonuses * reductions;
}
