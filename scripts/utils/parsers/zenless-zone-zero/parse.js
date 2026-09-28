import {
  round,
  pick,
  values,
  character,
  weapon,
  set,
} from '../../common.js';

const statIds = {
  11101: 'baseHp',
  11102: 'hp%',
  12101: 'baseAtk',
  12102: 'atk%',
  12201: 'baseImpact',
  13101: 'baseDef',
  13102: 'def%',
  20101: 'critRate%',
  21101: 'critDmg%',
  23101: 'penRatio%',
  23201: 'pen',
  30501: 'baseEnergyRegen',
  31201: 'baseAnomalyProficiency',
  31401: 'baseAnomalyMastery',
};

const statNames = {
  'HP': 'hp%',
  'ATK': 'atk%',
  'DEF': 'def%',
  'Impact': 'impact%',
  'Anomaly Mastery': 'anomalyMastery',
  'Anomaly Proficiency': 'anomalyProficiency',
  'Energy Regen': 'energyRegen%',
  'CRIT Rate': 'critRate%',
  'CRIT DMG': 'critDmg%',
  'PEN Ratio': 'penRatio%',
};

function arithmetic(expr, lvl) {
  const tokens = expr.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|lvl|\*\*|\/\/|[()+*/%\-]/g,
  ) ?? [];

  if (tokens.join('') !== expr.replace(/\s+/g, '')) {
    throw new Error(`Unsupported CAL expression: ${expr}`);
  }

  let i = 0;

  function atom() {
    const t = tokens[i++];

    if (t === '+' || t === '-') {
      return (t === '-' ? -1 : 1) * atom();
    }

    if (t === '(') {
      const n = sum();

      if (tokens[i++] !== ')') {
        throw new Error('Missing )');
      }

      return n;
    }

    if (t === 'lvl') {
      return lvl;
    }

    if (t !== undefined && /^\d|^\./.test(t)) {
      return Number(t);
    }

    throw new Error(`Invalid CAL token: ${t}`);
  }

  function power() {
    const n = atom();

    return tokens[i] === '**'
      ? (i++, n ** power())
      : n;
  }

  function product() {
    let n = power();

    while (['*', '/', '//', '%'].includes(tokens[i])) {
      const op = tokens[i++];
      const rhs = power();

      n = op === '*'
        ? n * rhs
        : op === '/'
          ? n / rhs
          : op === '//'
            ? Math.floor(n / rhs)
            : ((n % rhs) + rhs) % rhs;
    }

    return n;
  }

  function sum() {
    let n = product();

    while (['+', '-'].includes(tokens[i])) {
      const op = tokens[i++];
      const rhs = product();

      n = op === '+'
        ? n + rhs
        : n - rhs;
    }

    return n;
  }

  const result = sum();

  if (i !== tokens.length || !Number.isFinite(result)) {
    throw new Error(`Invalid CAL expression: ${expr}`);
  }

  return result;
}

function skills(data) {
  const result = {};

  for (const id of ['basic', 'dodge', 'assist', 'special', 'chain']) {
    const actions = [];

    for (const item of data.skill[id].description) {
      if (!('param' in item)) continue;

      for (const part of item.param) {
        if (!('param' in part)) {
          const match = part.desc.match(/\{CAL:(.*?)(?:,\d+,\d+)?\}/);

          if (!match) continue;

          const expr = match[1].replace(
            /AvatarSkillLevel\(\d+\)/g,
            'lvl',
          );

          const mult = Array.from(
            { length: 16 },
            (_, i) => round(arithmetic(expr, i + 1) / 100, 4),
          );

          actions.push({
            name: `${item.name} ${part.name}`,
            type: id,
            multipliers: [mult],
          });

          continue;
        }

        const details = values(part.param)[0];
        const { main, growth } = details;

        const mult = {
          mv: Array.from(
            { length: 16 },
            (_, i) => round((main + growth * i) / 10000, 4),
          ),
        };

        if (main !== details.stun_ratio && details.attribute_infliction > 0) {
          mult.anomaly = details.attribute_infliction;
        }

        actions.push({
          name: `${item.name} ${part.name}`,
          type: id,
          damage: {
            multipliers: [mult],
          },
        });
      }
    }

    result[id] = {
      name: '',
      actions,
    };
  }

  return result;
}

export function parseZzz(type, version, id, data) {
  if (type === 'character') {
    const b = data.stats;
    const l = data.level[6];

    const s = {
      baseHp: round(
        b.hp_growth / 10000 * 59
        + b.hp_max
        + l.hp_max,
      ),
      baseAtk: round(
        b.attack_growth / 10000 * 59
        + b.attack
        + l.attack,
      ),
      baseDef: round(
        b.defence_growth / 10000 * 59
        + b.defence
        + l.defence,
      ),
      baseImpact: round(b.break_stun),
      baseAnomalyMastery: round(b.element_abnormal_power),
      baseAnomalyProficiency: round(b.element_mystery),
    };

    for (const v of values(data.extra_level[6].extra)) {
      const stat = pick(statIds, v.prop);

      const value = stat.endsWith('%')
        ? round(v.value / 10000, 4)
        : v.value;

      s[stat] = (s[stat] ?? 0) + value;
    }

    return character('zzz', version, id, data, {
      quality: Number(data.rarity) + 1,
      element: values(data.element_type)[0].toLowerCase(),
      type: values(data.weapon_type)[0].toLowerCase(),
      stats: s,
      skills: skills(data),
    });
  }

  if (type === 'weapon') {
    const wt = values(data.weapon_type)[0].toLowerCase();
    const baseStat = wt === 'armorer' ? 'baseDef' : 'baseAtk';
    const stat = pick(statNames, data.rand_property.name);
    const value = data.rand_property.value * 2.5;

    return weapon('zzz', version, id, data, {
      quality: Number(data.rarity) + 1,
      type: wt,
      stats: {
        [baseStat]: round(data.base_property.value * 14.85),
        [stat]: stat.endsWith('%')
          ? value / 10000
          : Math.trunc(value),
      },
    });
  }

  if (type === 'set') {
    return set('zzz', version, id, data, {
      bonuses: [],
    });
  }

  throw new Error(`Unsupported ZZZ type: ${type}`);
}