export const gameIds = {
  gi: 'genshin-impact',
  hsr: 'honkai-star-rail',
  ww: 'wuthering-waves',
  zzz: 'zenless-zone-zero',
};

export const round = (n, digits = 0) => {
  const factor = 10 ** digits;
  const x = n * factor;
  const lower = Math.floor(x);
  const fraction = x - lower;
  return (fraction > 0.5 || (Math.abs(fraction - 0.5) < 1e-9 && lower % 2 !== 0) ? lower + 1 : lower) / factor;
};

export function pick(map, key) {
  if (!(key in map)) {
    throw new Error(`Unknown mapping: ${key}`);
  }

  return map[key];
}

export function base(type, version, id, data) {
  return {
    disabled: true,
    name: String(data.name),
    version: Number(version),
    id: Number(id),
    icon: `${gameIds[type]}/${data.__kind}/${id}.webp`,
  };
}

export function character(game, version, id, data, fields) {
  return {
    ...base(game, version, id, { ...data, __kind: 'character' }),
    ...fields,
    tagged: [],
    effects: [],
    memberPreset: {},
  };
}

export function weapon(game, version, id, data, fields) {
  return {
    ...base(game, version, id, { ...data, __kind: 'weapon' }),
    ...fields,
    effects: [],
  };
}

export function set(game, version, id, data, fields) {
  return {
    ...base(game, version, id, { ...data, __kind: 'set' }),
    ...fields,
    halfStat: '',
    effects: [],
  };
}
