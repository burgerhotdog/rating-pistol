import { createWorker } from 'tesseract.js';
import { GENERAL_LOOKUP } from '@/lookups';
import { cropBlob, cropPixels, snapToOption, WEAPON_DICT, SUBSTAT_DICT, MAIN_STAT_DICT_PER_COST } from './ocr.helpers';
import { COST_TEMPLATES } from '@/assets/ocr/cost/templates';

const { MAIN_STAT_TYPES } = GENERAL_LOOKUP['wuthering-waves'];

let worker = null;

const costConvert = {
  1: 0,
  3: 1,
  4: 2,
};

const imageMatch = (cropPixels, templatePixels) => {
  let score = 0;
  for (let i = 0; i < cropPixels.length; i += 4) {
    const gray1 = 0.299 * cropPixels[i] + 0.587 * cropPixels[i+1] + 0.114 * cropPixels[i+2];
    const gray2 = 0.299 * templatePixels[i] + 0.587 * templatePixels[i+1] + 0.114 * templatePixels[i+2];
    score += Math.abs(gray1 - gray2);
  }
  return score;
};

// Find the closest template
const findBestMatch = (cropPixels, templates) => {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const [name, templatePixels] of Object.entries(templates)) {
    const score = imageMatch(cropPixels, templatePixels);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = name;
    }
  }

  return bestMatch;
};

const initWorker = async () => {
  if (worker) return worker;
  worker = await createWorker('eng');
  return worker;
};

self.onmessage = async (e) => {
  const { imageBitmap } = e.data;

  try {
    const ocrWorker = await initWorker();

    async function regionToText(region, dict) {
      const blob = await cropBlob(region, imageBitmap);
      const { data: { text } } = await ocrWorker.recognize(blob);
      const validatedText = await snapToOption(text.trim(), Object.keys(dict));
      return validatedText;
    }

    const results = {};

    const weaponNameRegion = { x: 1600, y: 450, w: 250, h: 30};
    results.weaponId = WEAPON_DICT[regionToText(weaponNameRegion, WEAPON_DICT)];

    const slot1 = { x: 323, y: 664, w: 47, h: 47};
    const slot2 = { x: 696, y: 664, w: 47, h: 47};
    const slot3 = { x: 1070, y: 664, w: 47, h: 47};
    const slot4 = { x: 1445, y: 664, w: 47, h: 47};
    const slot5 = { x: 1819, y: 664, w: 47, h: 47};

    const cost1 = findBestMatch(await cropPixels(slot1, imageBitmap), COST_TEMPLATES);
    const cost2 = findBestMatch(await cropPixels(slot2, imageBitmap), COST_TEMPLATES);
    const cost3 = findBestMatch(await cropPixels(slot3, imageBitmap), COST_TEMPLATES);
    const cost4 = findBestMatch(await cropPixels(slot4, imageBitmap), COST_TEMPLATES);
    const cost5 = findBestMatch(await cropPixels(slot5, imageBitmap), COST_TEMPLATES);

    // slot 1
    const equipObj1 = {};
    const main1 = { x: 219, y: 727, w: 159, h: 20};
    equipObj1.mainStatId = MAIN_STAT_DICT_PER_COST[cost1][regionToText(main1, MAIN_STAT_DICT_PER_COST[cost1])];
    equipObj1.mainStatValue = MAIN_STAT_TYPES[costConvert[cost1]][equipObj1.mainStatId].VALUE;
    
    const m1line1 = {};
    const m1sub1 = { x: 63, y: 884, w: 394, h: 22};
    m1line1.subStatId = SUBSTAT_DICT[regionToText(m1sub1, SUBSTAT_DICT)];
    const m1val1 = { x: 300, y: 884, w: 73, h: 22};

    const m1line2 = {};
    const m1sub2 = { x: 63, y: 918, w: 394, h: 22};
    m1line2.subStatId = SUBSTAT_DICT[regionToText(m1sub2, SUBSTAT_DICT)];
    const m1val2 = { x: 300, y: 884, w: 73, h: 22};

    const m1line3 = {};
    const m1sub3 = { x: 63, y: 952, w: 394, h: 22};
    m1line3.subStatId = SUBSTAT_DICT[regionToText(m1sub3, SUBSTAT_DICT)];
    const m1val3 = { x: 300, y: 884, w: 73, h: 22};

    const m1line4 = {};
    const m1sub4 = { x: 63, y: 986, w: 394, h: 22};
    m1line4.subStatId = SUBSTAT_DICT[regionToText(m1sub4, SUBSTAT_DICT)];
    const m1val4 = { x: 300, y: 884, w: 73, h: 22};

    const m1line5 = {};
    const m1sub5 = { x: 63, y: 1020, w: 394, h: 22};
    m1line5.subStatId = SUBSTAT_DICT[regionToText(m1sub5, SUBSTAT_DICT)];
    const m1val5 = { x: 300, y: 884, w: 73, h: 22};

    equipObj1.subStatList = [m1line1, m1line2, m1line3, m1line4, m1line5]
  
    // slot 2
    const equipObj2 = {};
    const main2 = { x: 594, y: 727, w: 159, h: 20};
    equipObj2.mainStatId = MAIN_STAT_DICT_PER_COST[cost2][regionToText(main2, MAIN_STAT_DICT_PER_COST[cost2])];
    const m2sub1 = { x: 438, y: 884, w: 394, h: 22};
    const m2sub2 = { x: 438, y: 918, w: 394, h: 22};
    const m2sub3 = { x: 438, y: 952, w: 394, h: 22};
    const m2sub4 = { x: 438, y: 986, w: 394, h: 22};
    const m2sub5 = { x: 438, y: 1020, w: 394, h: 22};
    const m2val1 = { x: 678, y: 884, w: 73, h: 22};
    const m2val2 = { x: 678, y: 884, w: 73, h: 22};
    const m2val3 = { x: 678, y: 884, w: 73, h: 22};
    const m2val4 = { x: 678, y: 884, w: 73, h: 22};
    const m2val5 = { x: 678, y: 884, w: 73, h: 22};
  
    // slot 3
    const equipObj3 = {};
    const main3 = { x: 968, y: 727, w: 159, h: 20};
    equipObj3.mainStatId = MAIN_STAT_DICT_PER_COST[cost3][regionToText(main3, MAIN_STAT_DICT_PER_COST[cost3])];
    const m3sub1 = { x: 812, y: 884, w: 394, h: 22};
    const m3sub2 = { x: 812, y: 918, w: 394, h: 22};
    const m3sub3 = { x: 812, y: 952, w: 394, h: 22};
    const m3sub4 = { x: 812, y: 986, w: 394, h: 22};
    const m3sub5 = { x: 812, y: 1020, w: 394, h: 22};
    const m3val1 = { x: 1052, y: 884, w: 73, h: 22};
    const m3val2 = { x: 1052, y: 884, w: 73, h: 22};
    const m3val3 = { x: 1052, y: 884, w: 73, h: 22};
    const m3val4 = { x: 1052, y: 884, w: 73, h: 22};
    const m3val5 = { x: 1052, y: 884, w: 73, h: 22};
  
    // slot 4
    const equipObj4 = {};
    const main4 = { x: 1342, y: 727, w: 159, h: 20};
    equipObj4.mainStatId = MAIN_STAT_DICT_PER_COST[cost4][regionToText(main4, MAIN_STAT_DICT_PER_COST[cost4])];
    const m4sub1 = { x: 1185, y: 884, w: 394, h: 22};
    const m4sub2 = { x: 1185, y: 918, w: 394, h: 22};
    const m4sub3 = { x: 1185, y: 952, w: 394, h: 22};
    const m4sub4 = { x: 1185, y: 986, w: 394, h: 22};
    const m4sub5 = { x: 1185, y: 1020, w: 394, h: 22};
    const m4val1 = { x: 1426, y: 884, w: 73, h: 22};
    const m4val2 = { x: 1426, y: 884, w: 73, h: 22};
    const m4val3 = { x: 1426, y: 884, w: 73, h: 22};
    const m4val4 = { x: 1426, y: 884, w: 73, h: 22};
    const m4val5 = { x: 1426, y: 884, w: 73, h: 22};
  
    // slot 5
    const equipObj5 = {};
    const main5 = { x: 1715, y: 727, w: 159, h: 20};
    equipObj5.mainStatId = MAIN_STAT_DICT_PER_COST[cost5][regionToText(main5, MAIN_STAT_DICT_PER_COST[cost5])];
    const m5sub1 = { x: 1560, y: 884, w: 394, h: 22};
    const m5sub2 = { x: 1560, y: 918, w: 394, h: 22};
    const m5sub3 = { x: 1560, y: 952, w: 394, h: 22};
    const m5sub4 = { x: 1560, y: 986, w: 394, h: 22};
    const m5sub5 = { x: 1560, y: 1020, w: 394, h: 22};
    const m5val1 = { x: 1800, y: 884, w: 73, h: 22};
    const m5val2 = { x: 1800, y: 884, w: 73, h: 22};
    const m5val3 = { x: 1800, y: 884, w: 73, h: 22};
    const m5val4 = { x: 1800, y: 884, w: 73, h: 22};
    const m5val5 = { x: 1800, y: 884, w: 73, h: 22};

    results.equipList = [equipObj1, equipObj2, equipObj3, equipObj4, equipObj5]

    self.postMessage({ success: true, results });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};