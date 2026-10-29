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
    ref: 'basicAttack',
  },
  dodge: {
    name: 'Dodge',
    ref: 'dodge',
  },
  assist: {
    name: 'Assist',
    ref: 'assist',
  },
  special: {
    name: 'Special Attack',
    ref: 'specialAttack',
  },
  chain: {
    name: 'Chain Attack',
    ref: 'chainAttack',
  },
};

export function skills(data) {
  const result = {};

  // Classify a part by its own name only (e.g. "1st-Hit DMG Multiplier").
  // Returns the kind and a base that both halves of a pair share
  // (e.g. "1st-Hit"), which may be empty if the part name is just
  // "DMG Multiplier" / "Daze Multiplier".
  const classify = (partName) => {
    const isDaze = /\bdaze\b/i.test(partName);
    const isDmg = /\bdmg\b/i.test(partName);
    if (isDaze === isDmg) return null; // neither, or ambiguous

    const base = partName
      .replace(/\b(dmg|daze)\b/i, '')
      .replace(/\bmultiplier\b/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    return { kind: isDaze ? 'daze' : 'damage', base };
  };

  for (const id of Object.keys(categories)) {
    const actions = [];

    for (const item of data.skill[id].description) {
      if (!('param' in item)) continue;

      // Ordered entries for this item; paired parts share one entry
      const entries = [];
      const groups = new Map(); // base -> most recent entry

      for (const part of item.param) {
        // Legacy branch: unchanged behavior
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

          entries.push({
            raw: {
              name: `${item.name} ${part.name}`,
              type: id,
              multipliers: [mult],
            },
          });

          continue;
        }

        const details = Object.values(part.param)[0];
        const { main, growth } = details;
        const fullName = `${item.name} ${part.name}`;

        const mult = {
          mv: Array.from(
            { length: 16 },
            (_, i) => round((main + growth * i) / 10000, 4),
          ),
        };

        const info = classify(part.name);

        // Only the damage half carries the anomaly buildup
        if (
          info?.kind !== 'daze' &&
          main !== details.stun_ratio &&
          details.attribute_infliction > 0
        ) {
          mult.anomaly = details.attribute_infliction;
        }

        // Unrecognized name: behave like before (standalone damage action)
        if (!info) {
          entries.push({
            raw: {
              name: fullName,
              type: categories[id].ref,
              damage: { multipliers: [mult] },
            },
          });
          continue;
        }

        let entry = groups.get(info.base);

        // No group yet, or this kind is already filled (repeated name):
        // start a fresh group so later parts pair with this one.
        if (!entry || entry[info.kind]) {
          entry = {
            fullName,
            name: `${item.name} ${info.base}`.trim(),
            base: info.base,
          };
          groups.set(info.base, entry);
          entries.push(entry);
        }

        entry[info.kind] = mult;
      }

      for (const entry of entries) {
        if (entry.raw) {
          actions.push(entry.raw);
          continue;
        }

        const { damage, daze } = entry;

        // Paired: one action, damage first, then daze
        if (damage && daze) {
          actions.push({
            name: entry.name,
            type: categories[id].ref,
            damage: { multipliers: [damage] },
            daze: { multipliers: [daze] },
          });
          continue;
        }

        // Unpaired: keep original name and original behavior
        actions.push({
          name: entry.fullName,
          type: categories[id].ref,
          damage: { multipliers: [damage ?? daze] },
        });
      }
    }

    result[categories[id].ref] = {
      name: categories[id].name,
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