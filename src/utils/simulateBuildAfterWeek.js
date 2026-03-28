import { STATS } from '@/lookups';
import { computeRating, generateArtifact, computeTotalStat, buildSourceMapList } from '@/utils';

const DAILY_RESIN = {
  'genshin-impact': 180,
  'honkai-star-rail': 240,
  'wuthering-waves': 240,
  'zenless-zone-zero': 320,
};

const COST_PER_RUN = {
  'genshin-impact': 20,
  'honkai-star-rail': 40,
  'wuthering-waves': 60,
  'zenless-zone-zero': 60,
};

const BONUS_RESIN = {
  'genshin-impact': 60,
  'honkai-star-rail': 160,
  'wuthering-waves': 120,
  'zenless-zone-zero': 180,
};

const DROPS_PER_RUN = {
  'genshin-impact': 1.065,
  'honkai-star-rail': 2.1,
  'wuthering-waves': 4.33,
  'zenless-zone-zero': 3.25,
};

function match_penalty(current, target) {
  if (target === 0) return 1;

  const relativeDeficit = (target - current) / target;
  if (relativeDeficit <= 0) return 1;

  return Math.exp(-2 * relativeDeficit);
};

export function simulateBuildAfterWeek(gameId, charId, build, iter, criteria, buffs) {
  const resinPerWeek = DAILY_RESIN[gameId] * 7 + BONUS_RESIN[gameId];
  const runsPerWeek = resinPerWeek / COST_PER_RUN[gameId];
  const dropsPerWeek = Math.floor(runsPerWeek * DROPS_PER_RUN[gameId]);

  const { weaponId } = iter;

  let control = computeRating(gameId, charId, iter, criteria, buffs);
  let newIter = iter;

  for (let i = 0; i < dropsPerWeek; i++) {
    const [slotIndex, newArtifact] = generateArtifact(gameId);

    // Ignore wrong set
    if (!newArtifact.setId) continue;

    const newEquipList = newIter.equipList.map((currentArtifact, index) => {
      if (index !== slotIndex) return currentArtifact;
      return newArtifact;
    });
    
    const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);

    if (!criteria.MATCH) {
      if (newRating < control) continue;
      control = newRating;
      newIter = { weaponId, equipList: newEquipList };
    } else {
      const controlPenalty = criteria.MATCH
        .map((stat) => {
          const currentValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, newIter));
          const targetValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, build));
          return match_penalty(currentValue, targetValue);
        })
        .reduce((acc, mult) => acc * mult, 1);

      const newPenalty = criteria.MATCH
        .map((stat) => {
          const currentValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, { weaponId, equipList: newEquipList }));
          const targetValue = computeTotalStat(stat, buildSourceMapList(gameId, charId, build));
          return match_penalty(currentValue, targetValue);
        })
        .reduce((acc, mult) => acc * mult, 1);
      
      if (newRating * newPenalty < control * controlPenalty) continue;
      control = newRating;
      newIter = { weaponId, equipList: newEquipList };
    }
  }

  return newIter;
}
