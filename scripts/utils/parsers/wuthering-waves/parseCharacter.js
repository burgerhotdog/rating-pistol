import { round } from '../../common.js';

const elements = [
  'glacio',
  'fusion',
  'electro',
  'aero',
  'spectro',
  'havoc',
];

const types = [
  'broadblade',
  'sword',
  'pistols',
  'gauntlets',
  'rectifier',
];

const statNames = {
  'HP': 'hp%',
  'HP+': 'hp%',
  'HP Up': 'hp%',
  'ATK': 'atk%',
  'ATK+': 'atk%',
  'ATK Up': 'atk%',
  'DEF': 'def%',
  'DEF+': 'def%',
  'DEF Up': 'def%',
  'Crit. Rate': 'critRate%',
  'Crit. Rate+': 'critRate%',
  'Crit. Rate Up': 'critRate%',
  'Crit. DMG': 'critDmg%',
  'Crit. DMG+': 'critDmg%',
  'Crit. DMG Up': 'critDmg%',
  'Healing Bonus': 'healingBonus%',
  'Healing Bonus+': 'healingBonus%',
  'Glacio DMG Bonus': 'glacioDmgBonus%',
  'Glacio DMG Bonus+': 'glacioDmgBonus%',
  'Fusion DMG Bonus': 'fusionDmgBonus%',
  'Fusion DMG Bonus+': 'fusionDmgBonus%',
  'Electro DMG Bonus': 'electroDmgBonus%',
  'Electro DMG Bonus+': 'electroDmgBonus%',
  'Aero DMG Bonus': 'aeroDmgBonus%',
  'Aero DMG Bonus+': 'aeroDmgBonus%',
  'Spectro DMG Bonus': 'spectroDmgBonus%',
  'Spectro DMG Bonus+': 'spectroDmgBonus%',
  'Havoc DMG Bonus': 'havocDmgBonus%',
  'Havoc DMG Bonus+': 'havocDmgBonus%',
  'Energy Regen': 'energyRegen%',
};

function segment(s) {
  const [value, times] = s.replaceAll(' ', '').split('*');

  return value.endsWith('%')
    ? ['mv', round(Number(value.slice(0, -1)) / 100, 4), Number(times ?? 1)]
    : ['flat', Number(value), Number(times ?? 1)];
}

function multipliers(raw) {
  const out = raw[0].split('+').map((s) => {
    const [key, val, n] = segment(s);

    return {
      ...(n > 1 ? { times: n } : {}),
      [key]: [val],
    };
  });

  for (const line of raw.slice(1)) {
    line.split('+').forEach((s, i) => {
      const [key, val] = segment(s);
      out[i][key].push(val);
    });
  }

  return out;
}

function skills(data) {
  const ids = {
    1: 'normalAttack',
    2: 'resonanceSkill',
    3: 'resonanceLiberation',
    6: 'introSkill',
    7: 'forteCircuit',
  };

  const result = {};

  for (const group of ['1', '2', '3', '7', '6']) {
    const actions = [];

    for (const v of Object.values(data.skill_trees[group].skill.level)) {
      if (!v.param[0][0].includes('%')) continue;

      const fmt = v.format;
      let attr;

      if (fmt == null) {
        attr = null;
      } else if (fmt.includes('HP')) {
        attr = 'hp';
      } else if (fmt.includes('ATK')) {
        attr = 'atk';
      } else if (fmt.includes('DEF')) {
        attr = 'def';
      } else if (fmt.includes('Tune AMP')) {
        attr = 'tuneAmp';
      } else {
        throw new Error(`Unknown skill format: ${fmt}`);
      }

      actions.push({
        name: v.name,
        type: group === '1' ? 'basicAttack' : ids[group],
        damage: {
          ...(attr ? { attr } : {}),
          multipliers: multipliers(v.param[0]),
        },
      });
    }

    result[ids[group]] = {
      name: '',
      actions,
    };
  }

  const name = data.skill_trees[8].skill.name;

  result.outroSkill = {
    name,
    actions: [
      {
        name,
        type: 'outroSkill',
      },
    ],
  };

  return result;
}

export function parseCharacter(id, data) {
  const b = data.stats[6][90];

  const s = {
    baseHp: Math.floor(b.life),
    baseAtk: Math.floor(b.atk),
    baseDef: Math.floor(b.def),
  };

  const asc = {};

  for (const v of Object.values(data.skill_trees)) {
    if (v.node_type !== 4 || !v.skill) continue;

    const stat = statNames[v.skill.name];
    if (!stat) continue;

    asc[stat] =
      (asc[stat] ?? 0)
      + Number(v.skill.param[0].replace(/%$/, '')) / 100;
  }

  for (const [stat, val] of Object.entries(asc).reverse()) {
    s[stat] = round(val, stat.endsWith('%') ? 4 : 1);
  }

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `wuthering-waves/character/${id}.webp`,
    quality: Number(data.rarity),
    element: elements[Number(data.element) - 1],
    type: types[Number(data.weapon) - 1],
    stats: s,
    tagged: [],
    effects: [],
    skills: skills(data),
    memberPreset: {},
  };
}
