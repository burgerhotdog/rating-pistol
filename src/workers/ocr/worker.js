import { createWorker } from 'tesseract.js';
import { distance as findDistance } from 'fastest-levenshtein';
import {
  whitelistStat,
  whitelistValue,
  weaponNameToId,
  mainStatNameToIdByCost,
  subStatFragmentToSuffix,
  subStatValueOptionsById,
} from './helpers/maps';
import { getSetId } from "./getSetId";
import { getCost } from "./getCost";

let worker = null;

const initWorker = async () => {
  if (worker) return worker;
  worker = await createWorker('eng');
  return worker;
};

self.onmessage = async ({ data }) => {
  const { imageBitmap } = data;

  try {
    const ocrWorker = await initWorker();

    async function ocrRegion(region, mode = 7, whitelist = '') {
      const canvas = new OffscreenCanvas(region.w, region.h);
      const cropCtx = canvas.getContext('2d');
      cropCtx.drawImage(imageBitmap, region.x, region.y, region.w, region.h, 0, 0, region.w, region.h);
      const blob = await canvas.convertToBlob();
      const params = {
        tessedit_pageseg_mode: mode,
        ...(whitelist && { tessedit_char_whitelist: whitelist }),
      };

      const { data: { text } } = await ocrWorker.recognize(blob, params);
      return text.replace(/\s+/g, ' ').trim();
    }

    function matchString(text, options, threshold = 8) {
      let bestMatch = null;
      let shortest = Infinity;

      for (const option of options) {
        const distance = findDistance(text, String(option));
        if (distance < shortest) {
          shortest = distance;
          bestMatch = option;
        }
      }

      return shortest <= threshold ? bestMatch : null;
    }

    // weaponId
    const weaponRegion = { x: 1600, y: 450, w: 250, h: 30};
    const weaponNameRaw = await ocrRegion(weaponRegion);
    const weaponName = matchString(weaponNameRaw, Object.keys(weaponNameToId));
    const weaponId = weaponNameToId[weaponName];

    // equipList
    let equipList = [];
    for (let equipIndex = 0; equipIndex < 5; equipIndex++) {
      const offset = !equipIndex ? 0 : 4;
      const valueOffset = equipIndex === 4 ? 4 : 0;

      // cost
      const cost = await getCost(imageBitmap, equipIndex);

      // setId
      const setId = await getSetId(imageBitmap, equipIndex);

      // mainStatId
      const mainStatRegion = { 
        x: 219 + equipIndex * 374 + offset,
        y: 724,
        w: 153,
        h: 20,
      };
      const mainStatNameRaw = await ocrRegion(mainStatRegion, 7, whitelistStat);
      const mainStatName = matchString(mainStatNameRaw, Object.keys(mainStatNameToIdByCost[cost]));
      const mainStatId = mainStatNameToIdByCost[cost][mainStatName];

      // mainStatValue
      const mainStatValueRegion = { 
        x: 315 + equipIndex * 374 + valueOffset,
        y: 756,
        w: 31,
        h: 24,
      };
      const mainStatValueString = await ocrRegion(mainStatValueRegion, 8, whitelistValue);
      const mainStatValue = Number(mainStatValueString) / 100;

      // mainStatFlatId
      const mainStatFlatId = cost === '1' ? 'FLAT_HP' : 'FLAT_ATK';

      // mainStatFlatValue
      const mainStatFlatRegion = { 
        x: 329 + equipIndex * 374 + offset,
        y: 846,
        w: 43,
        h: 18,
      };
      const mainStatFlatString = await ocrRegion(mainStatFlatRegion, 8, whitelistValue);
      const mainStatFlatValue = Number(mainStatFlatString)

      // subStatList
      let subStatList = [];
      for (let lineIndex = 0; lineIndex < 5; lineIndex++) {
        // subStatId
        const subStatRegion = {
          x: 64 + equipIndex * 374 + offset,
          y: 882 + lineIndex * 34,
          w: 218,
          h: 21,
        };
        const subStatFragmentRaw = await ocrRegion(subStatRegion, 7, whitelistStat);
        const subStatFragment = matchString(subStatFragmentRaw, Object.keys(subStatFragmentToSuffix));
        const subStatSuffix = subStatFragmentToSuffix[subStatFragment];

        // subStatValue
        const subStatValueRegion = {
          x: 315 + equipIndex * 374 + offset,
          y: 882 + lineIndex * 34,
          w: 58,
          h: 21,
        };
        const subStatValueString = await ocrRegion(subStatValueRegion, 13, whitelistValue);
        // finalize id
        const isPercent = subStatValueString.endsWith('%');
        const subStatPrefix = isPercent ? 'PERCENT' : 'FLAT';
        const subStatId = `${subStatPrefix}_${subStatSuffix}`;
        // finalize value
        const noPercentStr = subStatValueString.endsWith('%') ? subStatValueString.slice(0, -1) : subStatValueString;
        const subStatValueRaw = matchString(noPercentStr, subStatValueOptionsById[subStatId]);
        const subStatValue = isPercent ? subStatValueRaw / 100 : subStatValueRaw;

        subStatList.push({ subStatId, subStatValue });
      }
      equipList.push({ cost, setId, mainStatId, mainStatValue, mainStatFlatId, mainStatFlatValue, subStatList });
    }

    self.postMessage({ success: true, build: { weaponId, equipList } });
  } catch (err) {
    console.log(err);
    self.postMessage({ success: false, error: err.message });
  }
};
