import { createWorker } from 'tesseract.js';
import { WEAPON_LOOKUP, GENERAL_LOOKUP } from '@/lookups';
import { cropBlob, cropPixels, snapToOption } from './ocr.helpers';
import { COST_TEMPLATES } from '@/assets/ocr/cost/templates';

const weaponsList = Object.entries(WEAPON_LOOKUP['wuthering-waves']).map(([id, { NAME }]) => ([NAME, id]));
const weaponsDict = Object.fromEntries(weaponsList);

const { MAIN_STAT_TYPES, SUB_STAT_TYPES } = GENERAL_LOOKUP['wuthering-waves'];
const subStatDict = Object.entries(SUB_STAT_TYPES).map(([id, { NAME }]) => ([NAME, id]));

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
    const results = {};

    const weaponNameRegion = { x: 1600, y: 450, w: 250, h: 30};
    const blob = await cropBlob(weaponNameRegion, imageBitmap);
    const { data: { text } } = await ocrWorker.recognize(blob);
    results.weaponId = weaponsDict[snapToOption(text.trim(), Object.keys(weaponsDict))];

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

    results.list = [cost1, cost2, cost3, cost4, cost5];

    // slot 1
    const equipObj1 = {};
    const main1 = { x: 219, y: 727, w: 159, h: 20};
    const main1Blob = await cropBlob(main1, imageBitmap);
    const { data: { text: main1Text } } = await ocrWorker.recognize(main1Blob);
    console.log(snapToOption(main1Text.trim(), Object.entries(MAIN_STAT_TYPES[costConvert[cost1]]).map(([id, { NAME }]) => ([NAME, id]))));
    equipObj1.mainStatId = Object.fromEntries(Object.entries(MAIN_STAT_TYPES[costConvert[cost1]]).map(([id, { NAME }]) => ([NAME, id])))[snapToOption(main1Text.trim(), Object.entries(MAIN_STAT_TYPES[costConvert[cost1]]).map(([id, { NAME }]) => ([NAME, id])))];
    equipObj1.mainStatValue = MAIN_STAT_TYPES[costConvert[cost1]][equipObj1.mainStatId].VALUE;

    console.log(equipObj1);
    
    const m1line1 = {};
    const m1sub1 = { x: 63, y: 884, w: 394, h: 22};
    const m1sub1Blob = await cropBlob(m1sub1, imageBitmap);
    const { data: { text: m1sub1Text } } = await ocrWorker.recognize(m1sub1Blob);
    m1line1.subStatId = subStatDict[snapToOption(m1sub1Text.trim(), Object.keys(Object.fromEntries(subStatDict)))];
    const m1val1 = { x: 300, y: 884, w: 73, h: 22};
    const m1val1Blob = await cropBlob(m1val1, imageBitmap);
    const { data: { text: m1val1Text } } = await ocrWorker.recognize(m1val1Blob);
    m1line1.subStatValue = Number(m1val1Text);

    const m1line2 = {};
    const m1sub2 = { x: 63, y: 918, w: 394, h: 22};
    const m1val2 = { x: 300, y: 884, w: 73, h: 22};

    const m1line3 = {};
    const m1sub3 = { x: 63, y: 952, w: 394, h: 22};
    const m1val3 = { x: 300, y: 884, w: 73, h: 22};

    const m1line4 = {};
    const m1sub4 = { x: 63, y: 986, w: 394, h: 22};
    const m1val4 = { x: 300, y: 884, w: 73, h: 22};

    const m1line5 = {};
    const m1sub5 = { x: 63, y: 1020, w: 394, h: 22};
    const m1val5 = { x: 300, y: 884, w: 73, h: 22};

    equipObj1.subStatList = [m1line1, m1line2, m1line3, m1line4, m1line5]
  
    const equipObj2 = {};
    const main2 = { x: 594, y: 727, w: 159, h: 20};
    const main2Blob = await cropBlob(main2, imageBitmap);
    const { data: { text: main2Text } } = await ocrWorker.recognize(main2Blob);
    equipObj2.mainStatId = Object.fromEntries(Object.entries(MAIN_STAT_TYPES[costConvert[cost2]]).map(([id, { NAME }]) => ([NAME, id])))[snapToOption(main2Text.trim(), Object.entries(MAIN_STAT_TYPES[costConvert[cost2]]).map(([id, { NAME }]) => ([NAME, id])))];
    equipObj2.mainStatValue = MAIN_STAT_TYPES[costConvert[cost2]][equipObj2.mainStatId].VALUE;

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
  
    const equipObj3 = {};
    const main3 = { x: 968, y: 727, w: 159, h: 20};
    const main3Blob = await cropBlob(main3, imageBitmap);
    const { data: { text: main3Text } } = await ocrWorker.recognize(main3Blob);
    equipObj3.mainStatId = Object.fromEntries(Object.entries(MAIN_STAT_TYPES[costConvert[cost3]]).map(([id, { NAME }]) => ([NAME, id])))[snapToOption(main3Text.trim(), Object.entries(MAIN_STAT_TYPES[costConvert[cost3]]).map(([id, { NAME }]) => ([NAME, id])))];
    equipObj3.mainStatValue = MAIN_STAT_TYPES[costConvert[cost3]][equipObj3.mainStatId].VALUE;

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
  
    const equipObj4 = {};
    const main4 = { x: 1342, y: 727, w: 159, h: 20};
    const main4Blob = await cropBlob(main4, imageBitmap);
    const { data: { text: main4Text } } = await ocrWorker.recognize(main4Blob);
    equipObj4.mainStatId = Object.fromEntries(Object.entries(MAIN_STAT_TYPES[costConvert[cost4]]).map(([id, { NAME }]) => ([NAME, id])))[snapToOption(main4Text.trim(), Object.entries(MAIN_STAT_TYPES[costConvert[cost4]]).map(([id, { NAME }]) => ([NAME, id])))];
    equipObj4.mainStatValue = MAIN_STAT_TYPES[costConvert[cost4]][equipObj4.mainStatId].VALUE;

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
  
    const equipObj5 = {};
    const main5 = { x: 1715, y: 727, w: 159, h: 20};
    const main5Blob = await cropBlob(main5, imageBitmap);
    const { data: { text: main5Text } } = await ocrWorker.recognize(main5Blob);
    equipObj5.mainStatId = Object.fromEntries(Object.entries(MAIN_STAT_TYPES[costConvert[cost5]]).map(([id, { NAME }]) => ([NAME, id])))[snapToOption(main5Text.trim(), Object.entries(MAIN_STAT_TYPES[costConvert[cost5]]).map(([id, { NAME }]) => ([NAME, id])))];
    equipObj5.mainStatValue = MAIN_STAT_TYPES[costConvert[cost5]][equipObj5.mainStatId].VALUE;

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