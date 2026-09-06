import { WW, CHARACTER, WEAPON } from '@/data';
import { ocrRegion } from './ocrRegion';
import { matchString } from './matchString';

const nameToId =
  Object.fromEntries(
    Object.values(CHARACTER[WW])
      .map(({ name, id }) => [name, id])
  );

export async function ocrId(imageBitmap, ocrWorker) {
  const region = { x: 67, y: 24, w: 600, h: 54 };
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 7, 'id');
  const name = matchString(text, Object.keys(nameToId), 10);
  return nameToId[name];
}

const weaponNameToId =
  Object.fromEntries(
    Object.values(WEAPON[WW])
      .map(({ name, id }) => [name, id])
  );

export async function ocrWeaponId(imageBitmap, ocrWorker) {
  const region = { x: 1600, y: 450, w: 250, h: 30 };
  const text = await ocrRegion(region, imageBitmap, ocrWorker);
  const weaponName = matchString(text, Object.keys(weaponNameToId));
  return weaponNameToId[weaponName];
}

const mainstatNameToId = {
  4: {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
    'Crit. Rate': 'critRate%',
    'Crit. DMG': 'critDmg%',
    'Healing Bonus': 'healingBonus%',
  },
  3: {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
    'Glacio DMG Bonus': 'glacioDmgBonus%',
    'Fusion DMG Bonus': 'fusionDmgBonus%',
    'Electro DMG Bonus': 'electroDmgBonus%',
    'Aero DMG Bonus': 'aeroDmgBonus%',
    'Spectro DMG Bonus': 'spectroDmgBonus%',
    'Havoc DMG Bonus': 'havocDmgBonus%',
    'Energy Regen': 'energyRegen%',
  },
  1: {
    'HP': 'hp%',
    'ATK': 'atk%',
    'DEF': 'def%',
  },
};

export async function ocrMainstatId(imageBitmap, ocrWorker, index, cost) {
  const offset = !index ? 0 : 4;
  const region = { 
    x: 219 + index * 374 + offset,
    y: 724,
    w: 153,
    h: 20,
  };
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 7, 'stat');
  const mainstatName = matchString(text, Object.keys(mainstatNameToId[cost]));
  return mainstatNameToId[cost][mainstatName];
}

export async function ocrMainstatValue(imageBitmap, ocrWorker, index) {
  const offset = index === 4 ? 4 : 0;
  const region = {
    x: 315 + index * 374 + offset,
    y: 756,
    w: 31,
    h: 24,
  };
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 8, 'value');
  return Math.round(Number(text) * 100);
}

export async function ocrMainstatSubValue(imageBitmap, ocrWorker, index) {
  const offset = !index ? 0 : 4;
  const region = {
    x: 329 + index * 374 + offset,
    y: 846,
    w: 43,
    h: 18,
  };
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 8, 'value');
  return Number(text);
}

const substatFragmentToPrefix = {
  'HP': 'hp',
  'ATK': 'atk',
  'DEF': 'def',
  'Crit. Rate': 'critRate',
  'Crit. DMG': 'critDmg',
  'Energy Regen': 'energyRegen',
  'Basic Attack DMG Bonus': 'basicAttackDmgBonus',
  'Heavy Attack DMG Bonus': 'heavyAttackDmgBonus',
  'Resonance Skill DMG': 'resonanceSkillDmgBonus',
  'Resonance Liberation': 'resonanceLiberationDmgBonus',
};

async function ocrSubstatPrefix(imageBitmap, ocrWorker, index, lineIndex) {
  const offset = !index ? 0 : 4;
  const region = {
    x: 64 + index * 374 + offset,
    y: 882 + lineIndex * 34,
    w: 218,
    h: 21,
  };
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 7, 'stat');
  const substatFragment = matchString(text, Object.keys(substatFragmentToPrefix));
  return substatFragmentToPrefix[substatFragment];
}

async function ocrSubstatValue(imageBitmap, ocrWorker, index, lineIndex) {
  const offset = !index ? 0 : 4;
  const region = {
    x: 315 + index * 374 + offset,
    y: 882 + lineIndex * 34,
    w: 58,
    h: 21,
  };
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 13, 'value');
  return text;
}

const substatValueOptions = {
  'hp': [320, 360, 390, 430, 470, 510, 540, 580],
  'atk': [30, 40, 50, 60],
  'def': [40, 50, 60, 70],
  'hp%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'atk%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'def%': [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  'critRate%': [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  'critDmg%': [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
  'energyRegen%': [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  'basicAttackDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'heavyAttackDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'resonanceSkillDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  'resonanceLiberationDmgBonus%': [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};

export async function ocrSubstat(imageBitmap, ocrWorker, index, lineIndex) {
  const substatPrefix = await ocrSubstatPrefix(imageBitmap, ocrWorker, index, lineIndex);
  const substatValueString = await ocrSubstatValue(imageBitmap, ocrWorker, index, lineIndex);
  
  const isPercent = substatValueString.endsWith('%');
  const id = `${substatPrefix}${isPercent ? '%' : ''}`;

  const noPercentStr = isPercent ? substatValueString.slice(0, -1) : substatValueString;
  const substatValueRaw = matchString(noPercentStr, substatValueOptions[id]);
  const value = Math.round(isPercent ? substatValueRaw * 100 : substatValueRaw);

  return { id, value };
}

const skillLevelRegions = {
  'normalAttack': { x: 1066, y: 187, w: 87, h: 22 },
  'resonanceSkill': { x: 840, y: 343, w: 87, h: 22 },
  'resonanceLiberation': { x: 1266, y: 343, w: 87, h: 22 },
  'forteCircuit': { x: 1186, y: 589, w: 87, h: 22 },
  'introSkill': { x: 920, y: 589, w: 87, h: 22 },
};

const skillLevelMatch = [
  'LV.1/10',
  'LV.2/10',
  'LV.3/10',
  'LV.4/10',
  'LV.5/10',
  'LV.6/10',
  'LV.7/10',
  'LV.8/10',
  'LV.9/10',
  'LV.10/10',
];

export async function ocrSkillLevel(imageBitmap, ocrWorker, skillKey) {
  const region = skillLevelRegions[skillKey];
  const text = await ocrRegion(region, imageBitmap, ocrWorker, 8, 'skill');
  const matched = matchString(text, skillLevelMatch);
  return skillLevelMatch.indexOf(matched) + 1;
}
