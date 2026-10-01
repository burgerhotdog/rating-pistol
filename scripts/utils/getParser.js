import { giCharacter } from './parsers/giCharacter.js';
import { giWeapon } from './parsers/giWeapon.js';
import { giSet } from './parsers/giSet.js';
import { hsrCharacter } from './parsers/hsrCharacter.js';
import { hsrWeapon } from './parsers/hsrWeapon.js';
import { hsrSet } from './parsers/hsrSet.js';
import { wwCharacter } from './parsers/wwCharacter.js';
import { wwWeapon } from './parsers/wwWeapon.js';
import { wwSet } from './parsers/wwSet.js';
import { wwEcho } from './parsers/wwEcho.js';
import { zzzCharacter } from './parsers/zzzCharacter.js';
import { zzzWeapon } from './parsers/zzzWeapon.js';
import { zzzSet } from './parsers/zzzSet.js';

const PARSERS = {
  gi: {
    character: giCharacter,
    weapon: giWeapon,
    set: giSet,
  },
  hsr: {
    character: hsrCharacter,
    weapon: hsrWeapon,
    set: hsrSet,
  },
  ww: {
    character: wwCharacter,
    weapon: wwWeapon,
    set: wwSet,
    echo: wwEcho,
  },
  zzz: {
    character: zzzCharacter,
    weapon: zzzWeapon,
    set: zzzSet,
  },
};

export function getParser(game, type, versionStr) {
  const parser = PARSERS[game][type];
  const version = Number(versionStr.split('+')[0]);

  return (id, data) => {
    const result = parser(id, data);
    result.version = version;

    return result;
  };
}
