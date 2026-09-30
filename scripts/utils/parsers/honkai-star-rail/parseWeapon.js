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

export function parseWeapon(id, data) {
  const b = data.stats[6];

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `honkai-star-rail/weapon/${id}.webp`,
    quality: Number(data.rarity.at(-1)),
    type: pick(types, data.base_type),
    stats: {
      baseHp: round(b.base_hp + b.base_hp_add * 79),
      baseAtk: round(b.base_attack + b.base_attack_add * 79),
      baseDef: round(b.base_defence + b.base_defence_add * 79),
    },
    effects: [],
  };
}
