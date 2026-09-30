import { round, pick } from '../../../common.js';

const types = {
  Rogue: 'hunt',
  Priest: 'abundance',
  Warrior: 'destruction',
  Knight: 'preservation',
  Warlock: 'nihility',
  Shaman: 'harmony',
  Mage: 'erudition',
  Memory: 'remembrance',
  Elation: 'elation',
};

const stats = {
  HPAddedRatio: 'hp%',
  AttackAddedRatio: 'atk%',
  DefenceAddedRatio: 'def%',
  CriticalChanceBase: 'critRate%',
  CriticalDamageBase: 'critDmg%',
  StatusProbabilityBase: 'effectHitRate%',
  HealRatioBase: 'outgoingHealingBoost%',
  SpeedDelta: 'spd',
  FireAddedRatio: 'fireDmgBonus%',
  IceAddedRatio: 'iceDmgBonus%',
  ImaginaryAddedRatio: 'imaginaryDmgBonus%',
  ThunderAddedRatio: 'lightningDmgBonus%',
  PhysicalAddedRatio: 'physicalDmgBonus%',
  QuantumAddedRatio: 'quantumDmgBonus%',
  WindAddedRatio: 'windDmgBonus%',
  BreakDamageAddedRatioBase: 'breakEffect%',
  SPRatioBase: 'energyRegenerationRate%',
  StatusResistanceBase: 'effectRes%',
  ElationDamageAddedRatioBase: 'elation%',
};

function skills(data) {
  const result = {};
  const ids = {
    'Basic ATK': 'basicAtk',
    'Skill': 'skill',
    'Ultimate': 'ultimate',
    'Talent': 'talent',
    'Memosprite Skill': 'memospriteSkill',
    'Memosprite Talent': 'memospriteTalent',
    'Elation Skill': 'elationSkill',
  };

  const all = [
    ...Object.entries(data.skills),
    ...(data.base_type === 'Memory' ? Object.entries(data.memosprite.skills) : []),
  ];

  for (const [, raw] of all) {
    const id = ids[raw.type_name];
    if (!id) continue;

    const multipliers = [];
    for (const value of Object.values(raw.level)) {
      for (const [i, hit] of value.param_list.entries()) {
        if (multipliers[i]) {
          multipliers[i].mv.push(hit);
        } else {
          multipliers.push({mv:[hit]});
        }
      }
    }

    const filtered = multipliers.filter(({ mv }) => mv.length <= 1 || mv.some((x) => x !== mv[0]));
    result[id] ??= { name: raw.name, actions: [] };
    result[id].actions.push({
      name: raw.name,
      type: id,
      damage: { multipliers: filtered },
    });
  }

  return result;
}

export function parseCharacter(id, data) {
  const charElement = data.damage_type === 'Thunder'
    ? 'lightning'
    : data.damage_type.toLowerCase();

  const b = data.stats[6];
  const charStats = {
    baseHp: round(b.hp_add * 79 + b.hp_base),
    baseAtk: round(b.attack_add * 79 + b.attack_base),
    baseDef: round(b.defence_add * 79 + b.defence_base),
    baseSpd: round(b.speed_base),
  };

  const asc = {};
  for (const node of Object.values(data.skill_trees)) {
    const v = node[1];
    if (!v || v.point_type !== 1) continue;
    const add = v.status_add_list[0];
    const stat = pick(stats, add.property_type);
    asc[stat] = (asc[stat] ?? 0) + add.value;
  }

  for (const [stat, val] of Object.entries(asc)) {
    charStats[stat] = (charStats[stat] ?? 0) + round(val, stat.endsWith('%') ? 4 : 1);
  }

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `honkai-star-rail/character/${id}.webp`,
    quality: Number(data.rarity.at(-1)),
    element: charElement,
    type: pick(types, data.base_type),
    stats: charStats,
    tagged: [],
    effects: [],
    skills: skills(data),
    memberPreset: {},
  };
}
