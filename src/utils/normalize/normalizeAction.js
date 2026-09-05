import { GI, WW, ZZZ, CHARACTER } from '@/data';
import { resolveRankedValue } from '@/utils';

const DEFAULT_DURATIONS = {
  [GI]: {
    'normalAttack': 1000,
    'chargedAttack': 1000,
    'plungeAttack': 1000,
    'elementalSkill': 1000,
    'elementalBurst': 2000,
  },
  [WW]: {
    'basicAttack': 500,
    'heavyAttack': 1500,
    'mid-airAttack': 1000,
    'dodgeCounter': 1500,
    'resonanceSkill': 1000,
    'introSkill': 1000,
  },
  [ZZZ]: {
    'basicAttack': 1000,
    'dodgeCounter': 1000,
    'dashAttack': 1000,
    'assistAttack': 1000,
    'specialAttack': 1000,
    'chainAttack': 2000,
  },
};

export const getCompressed = (multipliers, attr, { index, weaponRank }) => {
  const resolveScaling = (scaling) =>
    typeof scaling === 'number'
      ? scaling // fixed
      : scaling.length === 2
        ? resolveRankedValue(scaling, weaponRank) // ranked
        : scaling[index]; // indexed

  const compressed = { flat: 0, mvs: {}, hitCount: 0 };
  for (const { flat, mv, times = 1 } of multipliers) {
    if (flat) compressed.flat += resolveScaling(flat) * times;
    if (mv) {
      if (typeof mv === 'object' && !Array.isArray(mv)) { // dual attr scaling
        for (const [attrKey, scaling] of Object.entries(mv)) {
          compressed.mvs[attrKey] ??= 0;
          compressed.mvs[attrKey] += resolveScaling(scaling) * times;
        }
      } else { // single attr scaling
        compressed.mvs[attr] ??= 0;
        compressed.mvs[attr] += resolveScaling(mv) * times;
      }
    }
    compressed.hitCount += times;
  }
  return compressed;
};

export function normalizeAction(gameId, rawAction, spec) {
  const { ownerId, category, index } = spec;

  const action = {
    ...rawAction,
    ownerId, category, index,
    ref: `${category}.${index}`,
    id: `${ownerId}:${category}.${index}`,
  };

  action.duration ??= DEFAULT_DURATIONS[gameId][action.type] ?? 0;

  if (action.damage) {
    const damage = action.damage = { ...action.damage };
    if (action.type) damage.type ??= action.type;
    if (Array.isArray(damage.type)) {
      const modeIndex = CHARACTER[gameId][spec.ownerId].modes.indexOf(spec.mode);
      damage.type = damage.type[modeIndex];
    }
    const isGiPhysNa = gameId === GI && category === 'normalAttack' && spec.weaponType !== 'catalyst';
    damage.element ??= isGiPhysNa ? 'physical' : spec.charElement;
    damage.attr ??= 'atk';
    damage.compressed = getCompressed(
      damage.multipliers,
      damage.attr,
      { index: spec.mvIndex, weaponRank: spec.weaponRank },
    );

    // hitOffsets
    let offset = action.duration * 0.65;
    const hitOffsets = action.hitOffsets = [Math.round(offset)];
    let hitsLeft = damage.compressed.hitCount - 1;
    while (hitsLeft) {
      if (action.duration) {
        offset += 100;
        if (action.duration - offset <= 100) {
          action.duration += 100;
        }
      }
      hitOffsets.push(Math.round(offset));
      hitsLeft--;
    }
  }

  if (action.healing) {
    const healing = action.healing = { ...action.healing };
    if (healing.times === '$teamSize') healing.times = spec.teamSize;
    healing.attr ??= 'atk';
    healing.compressed = getCompressed(
      healing.multipliers,
      healing.attr,
      { index: spec.mvIndex, weaponRank: spec.weaponRank },
    );
  }

  if (action.shield) {
    const shield = action.shield = { ...action.shield };
    shield.attr ??= 'atk';
    shield.compressed = getCompressed(
      shield.multipliers,
      shield.attr,
      { index: spec.mvIndex, weaponRank: spec.weaponRank },
    );
  }

  // Resolve inflict status $mode
  if (action.inflict?.status) {
    action.inflict = { ...action.inflict };

    const shiftMode = spec.mode;
    const isValid = (
      shiftMode === 'glacioChafe' ||
      shiftMode === 'fusionBurst' ||
      shiftMode === 'electroFlare' ||
      shiftMode === 'aeroErosion' ||
      shiftMode === 'spectroFrazzle' ||
      shiftMode === 'havocBane');

    const resolve = (id) => {
      if (id !== '$mode') return id;
      if (isValid) return shiftMode;
    };

    const resolved = {};
    for (const status in action.inflict.status) {
      const resolvedStatus = resolve(status);
      if (!resolvedStatus) continue;
      resolved[resolvedStatus] = action.inflict.status[status];
    }

    if (Object.keys(resolved).length) {
      action.inflict.status = resolved;
    } else {
      delete action.inflict.status;
    }
  }

  // Resolve inflict shifting $mode
  if (action.inflict?.shifting === '$mode') {
    action.inflict = { ...action.inflict };

    if (
      spec.mode === 'tuneRupture' ||
      spec.mode === 'tuneStrain' ||
      spec.mode === 'hack'
    ) {
      action.inflict.shifting = spec.mode;
    } else {
      delete action.inflict.shifting;
    }
  }

  return action;
}
