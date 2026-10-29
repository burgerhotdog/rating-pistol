import { round, pick } from '../../common.js';

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

const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
};

function arithmetic(expr, lvl) {
  const tokens = expr.match(
    /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|lvl|\*\*|\/\/|[()+*/%-]/g,
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

const categories = {
  basic: {
    name: 'Basic Attack',
    types: [
      'Basic Attack',
    ],
  },
  dodge: {
    name: 'Dodge',
    types: [
      'Dash Attack',
      'Dodge Counter',
    ],
  },
  assist: {
    name: 'Assist',
    types: [
      'Quick Assist',
      'Defensive Assist',
      'Assist Follow-Up',
    ],
  },
  special: {
    name: 'Special Attack',
    types: [
      'Special Attack',
      'EX Special Attack',
    ],
  },
  chain: {
    name: 'Chain Attack',
    types: [
      'Chain Attack',
      'Ultimate',
    ],
  },
};

function splitActionType(str) {
  const index = str.indexOf(': ');
  return index === -1
    ? [undefined, str]
    : [str.slice(0, index), str.slice(index + 2)];
}

// Classify a part by its own name only (e.g. "1st-Hit DMG Multiplier").
// Returns the kind and a base that both halves of a pair share
// (e.g. "1st-Hit"), which may be empty if the part name is just
// "DMG Multiplier" / "Daze Multiplier".
const cleanName = (str) => {
  str = str.replaceAll(/\d(?:st|nd|rd|th)-Hit/gi, (match) => match[0]);

  if (/dmg/i.test(str) && str.includes('Multiplier')) {
    return {
      part: 'damage',
      cleaned: str.replace(/DMG Multiplier/i, '').replace(/\s{2,}/g, ' ').trim(),
    };
  }

  if (/daze/i.test(str) && str.includes('Multiplier')) {
    return {
      part: 'daze',
      cleaned: str.replace(/Daze Multiplier/i, '').replace(/\s{2,}/g, ' ').trim(),
    };
  }

  return {
    part: 'buff',
    cleaned: str,
  };
};

export function skills(data) {
  const result = {};

  for (const propId of Object.keys(categories)) {
    const skillName = categories[propId].name;
    const skillType = toCamelCase(skillName);
    const actions = [];

    for (const propEntry of data.skill[propId].description) {
      if (!('param' in propEntry)) continue;

      const [actionTypeName = skillName, actionName] = splitActionType(propEntry.name);
      const actionType = toCamelCase(actionTypeName);

      // Ordered entries for this item; paired parts share one entry
      const entries = [];
      const groups = new Map(); // base -> most recent entry

      for (const propSubEntry of propEntry.param) {
        if (!('param' in propSubEntry)) {
          // {CAL:expr,1,2} optionally followed by "%"
          const calRegex = /\{CAL:(.*?)(?:,\d+,\d+)?\}(%)?/g;

          const terms = [...propSubEntry.desc.matchAll(calRegex)];

          terms.forEach(([, rawExpr, percent], index) => {
            const expr = rawExpr.replace(/AvatarSkillLevel\(\d+\)/g, 'lvl');
            const scale = percent ? 100 : 1;

            const baseName = `${actionName} ${propSubEntry.name}`;

            entries.push({
              name: terms.length > 1 ? `${baseName} ${index + 1}` : baseName,
              buff: {
                multipliers: [
                  {
                    flat: Array.from({ length: 16 }, (_, i) =>
                      round(arithmetic(expr, i + 1) / scale, 4)
                    ),
                  },
                ],
              },
            });
          });

          continue;
        }

        const { part, cleaned } = cleanName(propSubEntry.name);

        const name = `${actionTypeName}: ${actionName}${cleaned.length ? ` ${cleaned}` : ''}`;

        // Matches terms like:
        //   {Skill:1101003, Prop:1001}
        //   {Skill:1101003, Prop:1001}*2
        //   {{Skill:1031002, Prop:1001}/3}*3
        const termRegex = /\{?\{Skill:(\d+), Prop:\d+\}(?:\/(\d+)\}\*\2)?/g;

        const terms = [...propSubEntry.desc.matchAll(termRegex)].map((m) => ({
          skillId: m[1],
          n: m[2] ? Number(m[2]) : 1,
        }));

        // Fallback: if the desc couldn't be parsed, use the first param like before
        if (!terms.length) {
          terms.push({ skillId: Object.keys(propSubEntry.param)[0], n: 1 });
        }

        const multipliers = [];

        for (const { skillId, n } of terms) {
          const data = propSubEntry.param[skillId];
          if (!data) continue;

          const { main, growth, attribute_infliction } = data;

          multipliers.push({
            mv: Array.from({ length: 16 }, (_, i) =>
              round((main + growth * i) / n / 10000, 4)
            ),
            ...((part === 'damage' && attribute_infliction > 0) && {
              anomaly: round(attribute_infliction / n / 10000, 4),
            }),
            ...(n > 1 && { times: n }),
          });
        }

        if (!multipliers.length) continue;

        let action = groups.get(name);

        if (!action) {
          action = {
            name,
            type: actionType,
          };
          groups.set(name, action);
          entries.push(action);
        }

        action[part] = { multipliers };
      }

      for (const action of entries) {
        actions.push(action);
      }
    }

    result[skillType] = {
      name: skillName,
      actions,
    };
  }

  return result;
}

export function zzzCharacter(id, data) {
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

  for (const v of Object.values(data.extra_level[6].extra)) {
    const stat = pick(statIds, v.prop);

    const value = stat.endsWith('%')
      ? round(v.value / 10000, 4)
      : v.value;

    s[stat] = (s[stat] ?? 0) + value;
  }

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `zenless-zone-zero/character/${id}.webp`,
    quality: Number(data.rarity) + 1,
    element: Object.values(data.element_type)[0].toLowerCase(),
    type: Object.values(data.weapon_type)[0].toLowerCase(),
    stats: s,
    effects: [],
    skills: skills(data),
    memberPreset: {},
  };
}