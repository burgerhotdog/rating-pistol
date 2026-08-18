import { GI, WW, ZZZ, ECHO } from '@/data';
import { CHARACTER } from '@/data';
import { resolveRankedValue } from './resolveRanked';

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

const getCompressed = (multipliers, attr, { index, weaponRank }) => {
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

function normDamage(gameId, action, spec) {
  const { category, charElement, weaponType, mvIndex, weaponRank } = spec;
  const isGiPhysNa =
    gameId === GI &&
    category === 'normalAttack' &&
    weaponType !== 'catalyst';

  const damage = { ...action.damage };
  if ('type' in action) damage.type ??= action.type;

  // Resolve type array by mode
  if (Array.isArray(damage.type)) {
    const modeIndex = CHARACTER[gameId][spec.ownerId].modes.indexOf(spec.mode);
    damage.type = damage.type[modeIndex];
  }

  damage.element ??= isGiPhysNa ? 'physical' : charElement;
  damage.attr ??= 'atk';
  damage.compressed = getCompressed(damage.multipliers, damage.attr, { index: mvIndex, weaponRank });
  return damage;
}

function normHealing(action, spec) {
  const { mvIndex, weaponRank, teamSize } = spec;

  const healing = { ...action.healing };
  healing.attr ??= 'atk';
  healing.compressed = getCompressed(healing.multipliers, healing.attr, { index: mvIndex, weaponRank });
  if (healing.times === '$teamSize') healing.times = teamSize;
  return healing;
}

function normShield(action, spec) {
  const { mvIndex, weaponRank } = spec;

  const shield = { ...action.shield };
  shield.attr ??= 'atk';
  shield.compressed = getCompressed(shield.multipliers, shield.attr, { index: mvIndex, weaponRank });
  return shield;
}

export const normAction = (gameId, rawAction, spec) => {
  const { ownerId, category, index } = spec;
  const action = {
    ...rawAction,
    ownerId, category, index,
    ref: `${category}.${index}`,
    id: `${ownerId}:${category}.${index}`,
  };

  // Parts
  if ('damage' in action) action.damage = normDamage(gameId, action, spec);
  if ('healing' in action) action.healing = normHealing(action, spec);
  if ('shield' in action) action.shield = normShield(action, spec);

  // Init duration
  action.duration ??= DEFAULT_DURATIONS[gameId][action.type] ?? 0;

  // Init hitOffsets
  if (!('hitOffsets' in action)) {
    if (action.damage?.compressed) {
      let offset = action.duration * 0.65;
      action.hitOffsets = [Math.round(offset)];

      let hitsLeft = action.damage?.compressed.hitCount - 1;
      while (hitsLeft) {
        if (action.duration) {
          offset += 100;
          if (action.duration - offset <= 100) {
            action.duration += 100;
          }
        }
        action.hitOffsets.push(Math.round(offset));
        hitsLeft--;
      }
    }
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

function createMvIndexGetter(gameId, memberId, memberRank) {
  const defaultIndex = gameId === ZZZ ? 11 : 9;

  const { rankMods = {} } = CHARACTER[gameId][memberId];
  const addByCategory = {};
  for (const [rank, mod] of Object.entries(rankMods)) {
    if (Number(rank) > memberRank) continue;
    for (const [category, offset] of Object.entries(mod)) {
      addByCategory[category] ??= 0;
      addByCategory[category] += offset;
    }
  }

  return (category) => defaultIndex + (addByCategory[category] ?? 0);
}

export const getActionDefs = (gameId, member, teamSize) => {
  const getMvIndex = createMvIndexGetter(gameId, member.id, member.rank);
  const charData = CHARACTER[gameId][member.id];
  const actionDefs = {};

  // Character actions
  for (const [category, { actions }] of Object.entries(charData.skills)) {
    const spec = {
      ownerId: member.id,
      category,
      teamSize,
      mvIndex: getMvIndex(category),
      charElement: charData.element,
      mode: member.mode,
    }

    for (const [index, rawAction] of actions.entries()) {
      const action = normAction(gameId, rawAction, { ...spec, index });
      actionDefs[action.ref] = action;
    }
  }

  // Echo action
  if (gameId === WW) {
    const echoAction = ECHO[member.mainEcho]?.action;
    if (echoAction) {
      const spec = {
        ownerId: member.id,
        category: 'echoSkill',
        index: 0,
        teamSize,
      };
      const action = normAction(WW, echoAction, spec);
      actionDefs[action.ref] = action;
    }
  }

  return actionDefs;
};
