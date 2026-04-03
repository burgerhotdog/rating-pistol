import { COST_TEMPLATES as cost0 } from '@/assets/ocr/cost/0/templates';
import { COST_TEMPLATES as cost1 } from '@/assets/ocr/cost/1/templates';
import { COST_TEMPLATES as cost2 } from '@/assets/ocr/cost/2/templates';
import { COST_TEMPLATES as cost3 } from '@/assets/ocr/cost/3/templates';
import { COST_TEMPLATES as cost4 } from '@/assets/ocr/cost/4/templates';
import { WEAPONS, STATS } from '@/data';

const { MAIN_STAT_TYPES } = STATS['wuthering-waves'];

export const whitelistStat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .';
export const whitelistValue = '0123456789.%';

export const weaponNameToId = Object.fromEntries(
  Object.entries(WEAPONS['wuthering-waves']).map(([id, { name }]) => ([name, id]))
);

export const costRegions = [
  { x: 323, y: 664, w: 47, h: 47},
  { x: 696, y: 664, w: 47, h: 47},
  { x: 1070, y: 664, w: 47, h: 47},
  { x: 1445, y: 664, w: 47, h: 47},
  { x: 1819, y: 664, w: 47, h: 47},
];

export const costPixelDataOptions = [cost0, cost1, cost2, cost3, cost4];

export const mainStatNameToIdByCost = Object.fromEntries(
  MAIN_STAT_TYPES.map((map, index) => {
    const nameToId = {};
    for (const [id, { NAME }] of Object.entries(map)) {
      nameToId[NAME] = id;
    }
    switch (index) {
      case 0:
        return [1, nameToId];
      case 1:
        return [3, nameToId];
      case 2:
        return [4, nameToId];
    }
  })
);

export const subStatFragmentToSuffix = {
  'HP': 'HP',
  'ATK': 'ATK',
  'DEF': 'DEF',
  'Crit. Rate': 'CR',
  'Crit. DMG': 'CD',
  'Energy Regen': 'ER',
  'Basic Attack DMG Bonus': 'BA',
  'Heavy Attack DMG Bonus': 'HA',
  'Resonance Skill DMG': 'RS',
  'Resonance Liberation': 'RL',
};

export const subStatValueOptionsById = {
  FLAT_HP: [320, 360, 390, 430, 470, 510, 540, 580],
  FLAT_ATK: [30, 40, 50, 60],
  FLAT_DEF: [40, 50, 60, 70],
  PERCENT_HP: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_ATK: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_DEF: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7],
  PERCENT_CR: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5],
  PERCENT_CD: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21],
  PERCENT_ER: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4],
  PERCENT_BA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_HA: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_RS: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
  PERCENT_RL: [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6],
};

function getLaplacian(pixelData, width, height) {
  // Convert to grayscale first
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const p = i * 4;
    gray[i] = 0.299 * pixelData[p] + 0.587 * pixelData[p + 1] + 0.114 * pixelData[p + 2];
  }

  // Apply discrete Laplacian kernel:
  //  0  1  0
  //  1 -4  1
  //  0  1  0
  const edges = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      edges[i] =
        gray[i - width] +
        gray[i + width] +
        gray[i - 1] +
        gray[i + 1] +
        -4 * gray[i];
    }
  }
  return edges;
}

export function matchLaplacian(pixelData, options, width, height) {
  const candidateEdges = getLaplacian(pixelData, width, height);

  let bestMatch = null;
  let shortest = Infinity;
  for (const [option, optionPixelData] of Object.entries(options)) {
    const templateEdges = getLaplacian(optionPixelData, width, height);
    let distance = 0;
    for (let i = 0; i < candidateEdges.length; i++) {
      const diff = candidateEdges[i] - templateEdges[i];
      distance += diff * diff;
    }
    if (distance < shortest) {
      shortest = distance;
      bestMatch = option;
    }
  }
  return bestMatch;
}
