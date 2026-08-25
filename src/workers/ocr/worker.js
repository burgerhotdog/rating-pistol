import { createWorker } from 'tesseract.js';
import {
  whitelistStat,
  whitelistValue,
  weaponNameToId,
  mainstatNameToIdByCost,
  substatFragmentToSuffix,
  valueOptionsById,
} from './helpers/maps';
import { compareStrings } from './helpers';
import { validateBitmap } from './validateBitmap';
import { getRank } from './getRank';
import { getSetId } from './getSetId';
import { getMainEcho } from './getMainEcho';
import { getCost } from './getCost';
import { getId } from './getId';

let worker = null;

const initWorker = async () => {
  if (worker) return worker;
  worker = await createWorker('eng');
  return worker;
};

self.onmessage = async ({ data }) => {
  const { imageBitmap } = data;
  const validation = validateBitmap(imageBitmap);
  if (!validation.success) return self.postMessage(validation);

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
        const distance = compareStrings(text, option);
        if (distance < shortest) {
          shortest = distance;
          bestMatch = option;
        }
      }

      return shortest <= threshold ? bestMatch : null;
    }

    // character
    const id = await getId(imageBitmap, ocrWorker);
    const rank = getRank(imageBitmap);

    // weapon
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
      const cost = getCost(imageBitmap, equipIndex);

      // setId
      const setId = await getSetId(imageBitmap, equipIndex);

      // mainstatId
      const mainstatRegion = { 
        x: 219 + equipIndex * 374 + offset,
        y: 724,
        w: 153,
        h: 20,
      };
      const mainstatNameRaw = await ocrRegion(mainstatRegion, 7, whitelistStat);
      const mainstatName = matchString(mainstatNameRaw, Object.keys(mainstatNameToIdByCost[cost]));
      const mainstatId = mainstatNameToIdByCost[cost][mainstatName];

      // mainstatValue
      const mainstatValueRegion = { 
        x: 315 + equipIndex * 374 + valueOffset,
        y: 756,
        w: 31,
        h: 24,
      };
      const mainstatValueString = await ocrRegion(mainstatValueRegion, 8, whitelistValue);
      const mainstatValue = Math.round(Number(mainstatValueString) * 100);

      // mainstatSubId
      const mainstatSubId = cost === 1 ? 'hp' : 'atk';

      // mainstatSubValue
      const mainstatSubRegion = { 
        x: 329 + equipIndex * 374 + offset,
        y: 846,
        w: 43,
        h: 18,
      };
      const mainstatSubString = await ocrRegion(mainstatSubRegion, 8, whitelistValue);
      const mainstatSubValue = Number(mainstatSubString)

      // substats
      let substats = [];
      for (let lineIndex = 0; lineIndex < 5; lineIndex++) {
        // stat
        const substatRegion = {
          x: 64 + equipIndex * 374 + offset,
          y: 882 + lineIndex * 34,
          w: 218,
          h: 21,
        };
        const substatFragmentRaw = await ocrRegion(substatRegion, 7, whitelistStat);
        const substatFragment = matchString(substatFragmentRaw, Object.keys(substatFragmentToSuffix));
        const substatPrefix = substatFragmentToSuffix[substatFragment];

        // value
        const substatValueRegion = {
          x: 315 + equipIndex * 374 + offset,
          y: 882 + lineIndex * 34,
          w: 58,
          h: 21,
        };
        const substatValueString = await ocrRegion(substatValueRegion, 13, whitelistValue);

        // finalize stat
        const isPercent = substatValueString.endsWith('%');
        const substatSuffix = isPercent ? '%' : '';
        const substatId = `${substatPrefix}${substatSuffix}`;

        // finalize value
        const noPercentStr = substatValueString.endsWith('%') ? substatValueString.slice(0, -1) : substatValueString;
        const substatValueRaw = matchString(noPercentStr, valueOptionsById[substatId]);
        const substatValue = Math.round(isPercent ? substatValueRaw * 100 : substatValueRaw);

        substats.push({ id: substatId, value: substatValue });
      }

      const equip = { cost, setId, mainstatId, mainstatValue, mainstatSubId, mainstatSubValue, substats };

      // echoId
      equip.echoId = await getMainEcho(imageBitmap, equipIndex, setId, cost);

      equipList.push(equip);
    }

    const build = { id, rank, weaponId, equipList };
    self.postMessage({ success: true, entry: [id, build] });
  } catch (error) {
    console.error(error);
  }
};
