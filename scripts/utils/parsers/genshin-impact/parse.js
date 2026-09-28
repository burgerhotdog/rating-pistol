import { parseCharacter } from './parseCharacter.js';
import { parseWeapon } from './parseWeapon.js';
import { parseSet } from './parseSet.js';

export function parseGi(type, version, id, data) {
  const entry = {
    disabled: true,
    name: String(data.name),
    version: Number(version),
    id: Number(id),
    icon: `genshin-impact/${type}/${id}.webp`,
  };

  if (type === 'character') {
    parseCharacter(entry, data);
    entry.tagged = [];
    entry.effects = [];
    entry.memberPreset = {};
  }

  if (type === 'weapon'){
    parseWeapon(entry, data);
    entry.effects = [];
  }

  if (type === 'set') {
    parseSet(entry, data);
    entry.halfStat = '';
    entry.effects = [];
  }

  return entry;
}
