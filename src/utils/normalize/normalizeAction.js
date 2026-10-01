import { GI, WW, ZZZ, CHARACTER } from '@/data';
import { lerp } from '../math';

const DEFAULT_DURATIONS = {
  [GI]: {
    'normalAttack': 750,
    'chargedAttack': 1000,
    'plungingAttack': 1000,
    'elementalSkill': 1000,
    'elementalBurst': 1500,
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
    'basicAttack': 750,
    'dodgeCounter': 1000,
    'dashAttack': 1000,
    'assistAttack': 1000,
    'specialAttack': 1000,
    'chainAttack': 2000,
  },
};

export const getCompressed = (multipliers, attr, { index, weaponRank }) => {
  const resolveScaling = (scaling) => {
    if (typeof scaling === 'number') {
      return scaling;
    }

    if (scaling.length === 2) {
      const [r1, r5] = scaling;
      return lerp(r1, r5, (weaponRank - 1) / 4);
    }

    return scaling[index];
  }

  const compressed = { mvs: {}, flat: 0, hitCount: 0 };

  for (const { flat, mv, times = 1 } of multipliers) {
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

    if (flat) {
      compressed.flat += resolveScaling(flat) * times;
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
    key: `${ownerId}:${category}.${index}`,
  };

  if (action.buff) {
    const baseAttr = action.buff.baseAttr;
    const baseAttrValue = spec.baseMap[baseAttr] ?? 0;

    const { mv, flat } = action.buff.multipliers[0];
    const mvBuffValue = mv?.[spec.mvIndex] ?? 0;
    const flatBuffValue = flat?.[spec.mvIndex] ?? 0;
    action.buff.value = mvBuffValue * baseAttrValue + flatBuffValue;

    action.buff.mvIndex = spec.mvIndex;
    action.buff.baseAttrValue = baseAttrValue;
    return action;
  }

  if (action.type === 'elementalBurst' && CHARACTER[GI][ownerId]?.quality === 5) {
    action.duration ??= 2000;
  }
  action.duration ??= DEFAULT_DURATIONS[gameId][action.type] ?? 0;

  if (action.damage) {
    const damage = action.damage = { ...action.damage };

    if (action.type) {
      if (
        gameId === WW && (
          action.type === 'mid-airAttack' ||
          action.type === 'dodgeCounter'
        )
      ) {
        damage.type ??= 'basicAttack';
      } else {
        damage.type ??= action.type;
      }
    }

    if (gameId === WW && Array.isArray(damage.type)) {
      const modeIndex = CHARACTER[WW][spec.ownerId].modes.indexOf(spec.mode);
      damage.type = damage.type[modeIndex];
    }

    const isGiPhysNa = gameId === GI && category === 'normalAttack' && spec.weaponType !== 'catalyst';
    damage.element ??= isGiPhysNa ? 'physical' : spec.charElement;

    if (damage.multipliers) {
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

    if (gameId === GI && category === 'normalAttack') {
      // Gauge
      if (spec.weaponType !== 'bow') {
        damage.gauge ??= 1;
      }

      // Icd
      if (damage.type !== 'plunge') {
        if (spec.weaponType === 'sword' || spec.weaponType === 'claymore') {
          damage.icd = { tag: 'Normal Attack', time: 2500, hits: 3 };
        }

        if (spec.weaponType === 'polearm') {
          if (damage.type === 'normalAttack') {
            damage.icd = { tag: 'Normal Attack', time: 2500, hits: 3 };
          } else {
            damage.icd = { tag: 'Charged Attack', time: 500 };
          }
        }

        if (spec.weaponType === 'catalyst') {
          if (damage.type === 'normalAttack') {
            damage.icd = { tag: 'Normal Attack', time: 2500, hits: 3 };
          }
        }
      }
    }
  }

  if (action.healing) {
    const healing = action.healing = { ...action.healing };

    if (healing.targets === '$team') {
      healing.targets = spec.memberIds;
    }
    healing.targets ??= [spec.ownerId];

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
      shiftMode === 'havocBane'
    );

    const resolveMode = (statusId) => {
      if (statusId !== '$mode') {
        return statusId;
      }

      if (isValid) {
        return shiftMode;
      }
    };

    const resolved = {};
    for (const status in action.inflict.status) {
      const resolvedStatus = resolveMode(status);
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

  if (action.drain) {
    const drain = action.drain = { ...action.drain };
    if (drain.targets === '$team') {
      drain.targets = spec.memberIds;
    }
    drain.targets ??= [spec.ownerId];
  }

  return action;
}
