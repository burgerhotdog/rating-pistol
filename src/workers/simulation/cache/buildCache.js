import { WW, CHARACTER, WEAPON, ECHO } from '@/data';
import {
  buildEquipMap,
  buildBaseMap,
  clamp,
  getEnergyLevel,
  toMergedObj,
} from '@/utils';
import { getActionDefs } from './actions';
import { getEffectDefs } from './effects';

const getConvertedRotation = (gameId, member, actionDefs, memberIds) => {
  const teamSize = memberIds.length;

  const rotation = [];
  let duration = 0;

  // Convert refs to actions
  for (const ref of member.rotation) {
    const action = actionDefs[ref];

    if (
      teamSize === 1 &&
      (
        action.type === 'introSkill' ||
        action.type === 'outroSkill'
      )
    ) continue;

    duration += action.duration ?? 0;
    rotation.push(action);
  }

  if (gameId === WW) {
    // Insert main echo rotation
    const echoData = ECHO[member.mainEcho] ?? {};
    if (echoData.action) {
      let insertAtIndex = rotation.length;

      if (echoData.timing === 'start') {
        insertAtIndex = rotation[0]?.type === 'introSkill' ? 1 : 0;
      } else {
        if (rotation.at(-1)?.type === 'outroSkill') insertAtIndex = -1;
      }

      rotation.splice(insertAtIndex, 0, actionDefs['echoSkill.0']);
    }

    // Insert tune break action for first character
    if (member.id === memberIds[0]) {
      // Ensure no more than 8000 ms remain after tune break
      let timeLeft = duration;
      let insertAtIndex = 0;
      for (const action of rotation) {
        if (timeLeft <= 8000) break;

        timeLeft -= action.duration;
        insertAtIndex++;
      }

      if (insertAtIndex === 0) insertAtIndex++;

      rotation.splice(insertAtIndex, 0, {
        key: 'other:tuneBreak',
        ownerId: member.id,
      });
    }
  }

  if (!member.duration) {
    return { rotation, duration };
  }

  const adjustTiming = (time) => Math.round(time * member.duration / duration);

  return {
    rotation: rotation.map((action) => ({
      ...action,
      duration: adjustTiming(action.duration),
      ...(action.hitOffsets && {
        hitOffsets: action.hitOffsets.map(adjustTiming),
      }),
    })),
    duration: member.duration,
  };
};

export const buildCache = ({ gameId, charId, team }) => {
  const cache = { gameId, charId };
  const fTeam = team.filter((member) => member.id);

  cache.memberIds = fTeam.map((member) => member.id);
  cache.teamSize = fTeam.length;

  cache.member = {};

  for (const member of fTeam) {
    const baseMap = buildBaseMap(gameId, member.id, member.weaponId);

    const actionDefs = getActionDefs(gameId, member, cache.teamSize, baseMap);

    const mCache = {
      ...member,
      baseMap,
      ...getConvertedRotation(gameId, member, actionDefs, cache.memberIds),
    };

    if (member.build?.equipList) {
      mCache.equipList = member.build.equipList;
      mCache.equipMap = buildEquipMap(mCache.equipList);
      mCache.statMap = toMergedObj(baseMap, mCache.equipMap);
    }

    const effectDefs = getEffectDefs(gameId, member, { memberIds: cache.memberIds, actionDefs });

    mCache.staticMap = Object.values(effectDefs)
      .filter((effect) => effect.static)
      .reduce((acc, effect) => {
        const { stats } = effect.buff;
        return toMergedObj(acc, stats);
      }, {});

    mCache.effects = Object.fromEntries(
      Object.entries(effectDefs)
        .filter(([, effect]) => !effect.static)
    );

    const charData = CHARACTER[gameId][member.id];

    if (charData.tagged.includes('healing')) {
      mCache.healing = true;
    }

    if (charData.tagged.includes('shield')) {
      mCache.shield = true;
    }

    if (charData.energy) {
      mCache.energy = charData.energy;

      const { energyMin = 1, energyMax = Infinity } = charData;
      if (!mCache.statMap) {
        mCache.energyReq = energyMin;
      } else {
        const energyLevel = getEnergyLevel(gameId, mCache.statMap);
        mCache.energyReq = clamp(energyLevel, energyMin, energyMax);
      }
    }

    if (gameId === WW) {
      if (charData.concertoReq) {
        mCache.concertoPenalty = !WEAPON[WW][member.weaponId]?.concerto;
      }
    }

    cache.member[mCache.id] = mCache;
  }

  if (gameId === WW) {
    cacheTuneResponses(cache);
  }

  return cache;
};

const alwaysStrain = new Set([1209, 1510, 1413]);
const onlyStrainIfMode = new Set([1509, 1211]);

function cacheTuneResponses(cache) {
  cache.tuneStrainMaxStacks = 1;

  for (const mCache of Object.values(cache.member)) {
    const isStrain =
      alwaysStrain.has(mCache.id) ||
      (onlyStrainIfMode.has(mCache.id) && mCache.mode === 'tuneStrain');
    if (!isStrain) continue;

    mCache.tuneStrainResponse = true;
    cache.tuneStrainMaxStacks++;
  }
}
