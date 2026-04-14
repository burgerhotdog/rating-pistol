import { RATING, CHARACTERS, WEAPONS } from "@/data";
import { mergeStatMaps, computeTotalStat, compileStatMap } from "@/utils";

export function computeDamage(gameId, characterId, build, calcs, team) {
  return RATING[gameId].computeDamage(characterId, build, calcs, team);
}
