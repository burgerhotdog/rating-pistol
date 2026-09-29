import { parseCharacter } from './parseCharacter.js';
import { parseWeapon } from './parseWeapon.js';
import { parseSet } from './parseSet.js';
import { parseEcho } from './parseEcho.js';

export function parseWw(type, id, data) {
  switch (type) {
    case 'character':
      return parseCharacter(id, data);

    case 'weapon':
      return parseWeapon(id, data);

    case 'set':
      return parseSet(id, data);

    case 'echo':
      return parseEcho(id, data);
  }
}
