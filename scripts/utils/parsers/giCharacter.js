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

function splitLine(text) {
  return text.split(/(?=\/{param)/);
}

function parseParamString(text) {
  const regex = /\{param(\d+):([^}]+)\}([^{]*)/g;
  const matches = [...text.matchAll(regex)];

  return matches.map((match, index) => ({
    matchId: index + 1,
    paramIndex: parseInt(match[1], 10) - 1,
    formatCode: match[2].trim(),
    trailingText: match[3].trim(),
  }));
}

function parseSkills(skills, constellations) {
  const result = {};
  let energy;

  const dataSkills = skills
    .filter(({ promote }) => Object.keys(promote).length === 15)
    .map((dataSkill, i) => ({ ...dataSkill, type: skillTypes[i] }));

  for (const { name, type, promote } of dataSkills) {
    const template = promote[0];

    const actions = [];

    for (const line of template.desc.filter(Boolean)) {
      const [actionName, paramRefs] = line.split('|');

      if (actionName === 'Energy Cost') {
        const energyIndex = Number(paramRefs[6]);
        energy = template.param[energyIndex];
        continue;
      }

      if (
        actionName === 'Aimed Shot' ||
        actionName === 'Plunge DMG' ||
        !paramRefs
      ) continue;

      const subParamRefs = splitLine(paramRefs);

      const parts = paramRefs.split('/');
      const times = Number(paramRefs.match(/×(\d+)/)?.[1] ?? 1);

      for (const [index, part] of parts.entries()) {
        const matches = [...part.matchAll(/\{param(\d+):[^}]+\}/g)];
        if (!matches.length) continue;

        actions.push({
          name: parts.length > 1 ? `${actionName} ${index + 1}` : actionName,
          type,
          damage: {
            multipliers: matches.map((m) => ({
              mv: Array.from({ length: 15 }, (_, level) =>
                promote[level].param[Number(m[1]) - 1]
              ),
              ...(times > 1 && { times }),
            })),
          },
        });
      }
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
    ...(energy && { energy }),
    effects: [],
    skills,
    memberPreset: {},
  };
}
