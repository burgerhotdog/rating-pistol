import { createWorker } from 'tesseract.js';
import { GENERAL_LOOKUP } from '@/lookups';
import { ocrRegion, findBestMatch, COST_CROPS2, COST_CROPS, SUB_NAME_TO_ID, WEAPON_DICT, SUBSTAT_DICT, MAIN_STAT_DICT_PER_COST } from './ocr.helpers';
import { COST_TEMPLATES } from '@/assets/ocr/cost/templates';

const { MAIN_STAT_TYPES } = GENERAL_LOOKUP['wuthering-waves'];

let worker = null;

const costConvert = { 1: 0, 3: 1, 4: 2 };

const initWorker = async () => {
  if (worker) return worker;
  worker = await createWorker('eng');
  return worker;
};

self.onmessage = async (e) => {
  const { imageBitmap } = e.data;

  try {
    const ocrWorker = await initWorker();

    const weaponNameRegion = { x: 1600, y: 450, w: 250, h: 30};
    const weaponName = await ocrRegion(weaponNameRegion, imageBitmap, ocrWorker, WEAPON_DICT);
    const weaponId = WEAPON_DICT[weaponName];


    let equipList = [];
    for (let equipIndex = 0; equipIndex < 5; equipIndex++) {
      const equipObj = {};
      const cost = await regionToCost2(COST_CROPS[equipIndex], imageBitmap, ocrWorker);
      equipObj.cost = cost;
      console.log(cost);

      const offset = !equipIndex ? 0 : 4;
      const mainStatNameRegion = { 
        x: 219 + equipIndex * 374 + offset,
        y: 724,
        w: 153,
        h: 20,
      };
      const mainStatName = await ocrRegion(mainStatNameRegion, imageBitmap, ocrWorker, MAIN_STAT_DICT_PER_COST[cost]);
      
      equipObj.mainStatId = MAIN_STAT_DICT_PER_COST[cost][mainStatName];
      equipObj.mainStatValue = MAIN_STAT_TYPES[costConvert[cost]][equipObj.mainStatId].VALUE;

      let subStatList = [];
      for (let lineIndex = 0; lineIndex < 5; lineIndex++) {
        const line = {};

        const subStatNameRegion = {
          x: 64 + equipIndex * 374 + offset,
          y: 882 + lineIndex * 34,
          w: 218,
          h: 21,
        };
        const subStatName = await ocrRegion(subStatNameRegion, imageBitmap, ocrWorker, SUB_NAME_TO_ID);
        line.subStatId = SUB_NAME_TO_ID[subStatName];

        const subStatValueRegion = {
          x: 315 + equipIndex * 374 + offset,
          y: 882 + lineIndex * 34,
          w: 58,
          h: 21,
        };

        const subStatValueRaw = await ocrRegion(subStatValueRegion, imageBitmap, ocrWorker);

        if (subStatValueRaw.endsWith('%')) {
          line.subStatId = `PERCENT_${SUB_NAME_TO_ID[subStatName]}`;
          line.subStatValue = Number(subStatValueRaw.slice(0, -1)) / 100;
        } else {
          line.subStatId = `FLAT_${SUB_NAME_TO_ID[subStatName]}`;
          line.subStatValue = Number(subStatValueRaw);
        }

        subStatList.push(line);
      }
      equipObj.subStatList = subStatList;
      equipList.push(equipObj);
    }

    self.postMessage({ success: true, build: { weaponId, equipList } });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};