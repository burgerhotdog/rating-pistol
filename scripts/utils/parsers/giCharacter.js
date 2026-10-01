import { round, pick } from '../../common.js';

const skillTypes = ['normalAttack', 'elementalSkill', 'elementalBurst'];

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

function getColoredText(str) {
  const text = str.match(/<color=[^>]+>(.*?)<\/color>/)?.[1];

  return text
    ?.replace(/\{LINK#[^}]+\}/, '')
    .replace('{/LINK}', '')
    ?? null;
}

function addRankModify(result, constellations, rank) {
  const talentName = getColoredText(constellations[rank - 1].desc);

  const key = ['elementalBurst', 'elementalSkill', 'normalAttack']
    .find((key) => result[key].name === talentName)
    ?? 'normalAttack';

  const { actions, ...rest } = result[key];

  result[key] = {
    ...rest,
    rankModify: rank,
    actions,
  };
}

function parseSkills(skills, constellations) {
  const result = {};
  let energy;

  const dataSkills = skills
    .filter(({ promote }) => Object.keys(promote) === 15)
    .map((dataSkill, i) => ({ ...dataSkill, type: skillTypes[i] }));

  for (const { name, type, promote } of dataSkills) {
    const actions = [];

    for (const { desc, param } of promote[0]) {
      const matches = [...desc.matchAll(/\{param(\d+):[^}]+\}/g)];
      if (!matches.length) continue;

      const actionName = desc.split('|')[0];
      if (actionName === 'Energy Cost') {
        const [, paramIndex] = matches[0];
        energy = param[Number(paramIndex) - 1];
        continue;
      }

      actions.push({
        name: actionName,
        type,
        damage: {
          multipliers: matches.map((m) => ({
            mv: Array.from({ length: 15 }, (_, level) => promote[level].param[Number(m[1]) - 1]),
          })),
        },
      });
    }

    result[type] = { name, actions };
  }

  addRankModify(result, constellations, 3);
  addRankModify(result, constellations, 5);

  return { skills: result, energy };
}

export function giCharacter(id, data) {
  const mod = data.stats_modifier;
  const asc = mod.ascension[5];

  const [ascProp, ascValue] = Object.entries(asc)[3];

  const charStats = {
    baseHp: round(data.base_hp * mod.hp[90] + asc.fight_prop_base_hp),
    baseAtk: round(data.base_atk * mod.atk[90] + asc.fight_prop_base_attack),
    baseDef: round(data.base_def * mod.def[90] + asc.fight_prop_base_defense),
    [pick(stats, ascProp)]: ascValue,
  };

  if (data.elemental_mastery) {
    charStats.elementalMastery = (charStats.elementalMastery ?? 0) + data.elemental_mastery;
  }

  const { skills, energy } = parseSkills(data.skills, data.constellations);

  return {
    disabled: true,
    name: String(data.name),
    version: null,
    id: Number(id),
    icon: `genshin-impact/character/${id}.webp`,
    quality: data.rarity === 'QUALITY_PURPLE' ? 4 : 5,
    element: data.element.toLowerCase(),
    type: pick(types, data.weapon),
    stats: charStats,
    tagged: [],
    ...(energy && { energy }),
    effects: [],
    skills,
    memberPreset: {},
  };
}
