import { round, pick } from '../../../common.js';

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

export function parseWeapon(id, data) {
  const [raw, values] = Object.entries(data.stats_modifier)[1];
  const stat = pick(stats, raw);
  const rawValue = values.base * values.levels[90];
  const value = stat.endsWith('%') ? round(rawValue, 3) : round(rawValue);

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `genshin-impact/weapon/${id}.webp`,
    quality: Number(data.rarity),
    type: pick(types, data.weapon_type),
    stats: {
      baseAtk: round(data.stats_modifier.atk.base * data.stats_modifier.atk.levels[90] + data.ascension[6].fight_prop_base_attack),
      [stat]: value,
    },
    effects: [],
  };
}
