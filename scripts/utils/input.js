import { fetchJson, fetchImage } from './fetch.js';
import { getParser } from './getParser.js';

const mapped = {
  gi: {
    set: 'artifact',
  },
  hsr: {
    weapon: 'lightcone',
    set: 'relicset',
  },
  ww: {
    set: 'sonata',
  },
  zzz: {
    set: 'equipment',
  },
};

function imagePath(game, type, id, data) {
  if (game === 'gi') {
    return type === 'characterFull'
      ? data.icon.replace('AvatarIcon', 'Gacha_AvatarImg')
      : data.icon;
  }

  if (game === 'hsr') {
    if (type === 'character') {
      return `avataricon/avatar/${id}`;
    }

    if (type === 'characterFull') {
      return `avatardrawcard/${id}`;
    }

    if (type === 'weapon') {
      return `lightconemediumicon/${id}`;
    }

    return `itemfigures/${data.icon.slice(22, data.icon.lastIndexOf('.'))}`;
  }
  
  if (game === 'ww') {
    const raw = type === 'characterFull' ? data.background : data.icon;
    return raw.slice(13, raw.lastIndexOf('.'));
  }
  
  if (game === 'zzz') {
    if (type === 'character') {
      return data.icon.replace('IconRole', 'IconRoleCircle');
    }

    if (type === 'characterFull') {
      return data.icon;
    }

    if (type === 'weapon') {
      return data.code_name;
    }

    return data.icon.slice(41, data.icon.lastIndexOf('.'));
  }

  throw new Error(`Unsupported game: ${game}`);
}

export async function enterIds(rl, game, versionStr, type) {
  const mappedType = mapped[game][type] ?? type;
  const base = `https://static.nanoka.cc/${game}/${versionStr}/`;
  const index = await fetchJson(`${base}${mappedType}.json`);
  let ids;

  for (;;) {
    const raw = await rl.question(`Enter new ${type} IDs (separated by space, or press Enter to skip): `);

    if (raw === '') {
      return [];
    }

    ids = raw.trim().split(/\s+/);
    const invalid = ids.filter((id) => !Object.hasOwn(index, id));

    if (!invalid.length) {
      break;
    }

    console.log(`Invalid IDs: (${invalid.join(', ')}). Please try again.`);
  }

  ids.sort((a, b) => Number(a) - Number(b));
  const parser = getParser(game, type, versionStr);
  const out = [];

  for (const id of ids) {
    console.log(id);

    const data = mappedType === 'sonata'
      ? index[id]
      : await fetchJson(`${base}en/${mappedType}/${id}.json`);

    const url = `https://static.nanoka.cc/assets/${game}/${imagePath(game, type, id, data)}.webp`;

    out.push([
      id,
      await fetchImage(url),
      parser(id, data),
    ]);
  }

  return out;
}
