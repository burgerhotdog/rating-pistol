import { GENERAL_LOOKUP } from '@/lookups';
import { computeRating, generateArtifact } from '@/utils';

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

export function simulateBuildAfterWeek(gameId, charId, build, criteria, buffs) {
  const resinPerWeek = DAILY_RESIN[gameId] * 7 + BONUS_RESIN[gameId];
  const runsPerWeek = resinPerWeek / COST_PER_RUN[gameId];
  const dropsPerWeek = Math.floor(runsPerWeek * DROPS_PER_RUN[gameId]);

  const { weaponId } = build;

  let control = computeRating(gameId, charId, build, criteria, buffs);
  let iter = build;

  for (let i = 0; i < dropsPerWeek; i++) {
    const [slotIndex, newArtifact] = generateArtifact(gameId);

    // Ignore wrong set
    if (!newArtifact.setId) continue;

    const newEquipList = iter.equipList.map((currentArtifact, index) => {
      if (index !== slotIndex) return currentArtifact;
      return newArtifact;
    });
    
    const newRating = computeRating(gameId, charId, { weaponId, equipList: newEquipList }, criteria, buffs);
    if (newRating < control) continue;

    control = newRating;
    iter = { weaponId, equipList: newEquipList };
  }

  return iter;
};
