import { round, pick } from './common.js';

const types = {
  WEAPON_SWORD_ONE_HAND: 'sword',
  WEAPON_CLAYMORE: 'claymore',
  WEAPON_POLE: 'polearm',
  WEAPON_CATALYST: 'catalyst',
  WEAPON_BOW: 'bow',
};

const stats = {
  fight_prop_hp_percent: 'hp%',
  fight_prop_attack_percent: 'atk%',
  fight_prop_defense_percent: 'def%',
  fight_prop_element_mastery: 'elementalMastery',
  fight_prop_charge_efficiency: 'energyRecharge%',
  fight_prop_wind_add_hurt: 'anemoDmgBonus%',
  fight_prop_ice_add_hurt: 'cryoDmgBonus%',
  fight_prop_grass_add_hurt: 'dendroDmgBonus%',
  fight_prop_elec_add_hurt: 'electroDmgBonus%',
  fight_prop_rock_add_hurt: 'geoDmgBonus%',
  fight_prop_water_add_hurt: 'hydroDmgBonus%',
  fight_prop_fire_add_hurt: 'pyroDmgBonus%',
  fight_prop_physical_add_hurt: 'physicalDmgBonus%',
  fight_prop_critical: 'critRate%',
  fight_prop_critical_hurt: 'critDmg%',
  fight_prop_heal_add: 'healingBonus%',
};

function skills(data) {
  const result = {};
  const ids = [
    'normalAttack',
    'elementalSkill',
    'elementalBurst',
    'elementalBurst',
  ];
  
  for (const [index, value] of data.skills.entries()) {
    const promote = value.promote;
    if (Object.keys(promote).length !== 15) continue;

    const actions = [];
    for (const desc of promote[0].desc) {
      const matches = [...desc.matchAll(/\{param(\d+):[^}]+\}/g)];

      if (!matches.length) continue;

      actions.push({
        name: desc.split('|')[0],
        type: ids[index] ?? null,
        damage: {
          multipliers: matches.map(m => ({
            mv: Array.from({ length:15 }, (_, level) => promote[level].param[Number(m[1]) - 1]),
          })),
        },
      });
    }

    result[ids[index] ?? 'null'] = { name: value.name, actions };
  }

  return result;
}

export function parseCharacter(entry, data) {
  entry.quality = data.rarity === 'QUALITY_PURPLE' ? 4 : 5;

  entry.element = data.element.toLowerCase();

  entry.type = pick(types, data.weapon);

  const mod = data.stats_modifier;
  const asc = mod.ascension[5];

  const [ascProp, ascValue] = Object.entries(asc)[3];

  const s = {
    baseHp: round(data.base_hp * mod.hp[90] + asc.fight_prop_base_hp),
    baseAtk:round(data.base_atk * mod.atk[90] + asc.fight_prop_base_attack),
    baseDef:round(data.base_def * mod.def[90] + asc.fight_prop_base_defense),
    [pick(stats,ascProp)]: ascValue
  };

  if (data.elemental_mastery) {
    s.elementalMastery = (s.elementalMastery ?? 0) + data.elemental_mastery;
  }

  entry.stats = s;

  entry.skills = skills(data);
}
