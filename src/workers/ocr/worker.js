import { createWorker } from 'tesseract.js';
import { WW } from '@/data';
import { initBuild } from '@/utils';
import { valueOptionsById } from './helpers/maps';
import { validateBitmap } from './validateBitmap';
import { getRank } from './getRank';
import { getSetId } from './getSetId';
import { getMainEcho } from './getMainEcho';
import { getCost } from './getCost';
import {
  ocrId,
  ocrWeaponId,
  ocrMainstatId,
  ocrMainstatValue,
  ocrMainstatSubValue,
  ocrSubstatId,
  ocrSubstatValue,
} from './fields';
import { matchString } from './ocrRegion';

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

    const build = initBuild(WW);

    build.id = await ocrId(imageBitmap, ocrWorker);
    build.rank = getRank(imageBitmap);
    build.weaponId = await ocrWeaponId(imageBitmap, ocrWorker);

    // equipList
    for (let equipIndex = 0; equipIndex < 5; equipIndex++) {
      const equip = build.equipList[equipIndex];

      const offset = !equipIndex ? 0 : 4;
      const valueOffset = equipIndex === 4 ? 4 : 0;

      equip.cost = getCost(imageBitmap, equipIndex);
      equip.setId = await getSetId(imageBitmap, equipIndex);
      equip.echoId = await getMainEcho(imageBitmap, equipIndex, equip.setId, equip.cost);
      equip.mainstatId = await ocrMainstatId(imageBitmap, ocrWorker, equip.cost, equipIndex, offset);
      equip.mainstatValue = await ocrMainstatValue(imageBitmap, ocrWorker, equipIndex, valueOffset);
      equip.mainstatSubId = equip.cost === 1 ? 'hp' : 'atk';
      equip.mainstatSubValue = await ocrMainstatSubValue(imageBitmap, ocrWorker, equipIndex, offset);

      for (let lineIndex = 0; lineIndex < 5; lineIndex++) {
        const substat = equip.substats[lineIndex];

        const substatPrefix = await ocrSubstatId(imageBitmap, ocrWorker, equipIndex, offset, lineIndex);
        const substatValueString = await ocrSubstatValue(imageBitmap, ocrWorker, equipIndex, offset, lineIndex);

        // finalize stat
        const isPercent = substatValueString.endsWith('%');
        const substatSuffix = isPercent ? '%' : '';
        substat.id = `${substatPrefix}${substatSuffix}`;

        // finalize value
        const noPercentStr = substatValueString.endsWith('%') ? substatValueString.slice(0, -1) : substatValueString;
        const substatValueRaw = matchString(noPercentStr, valueOptionsById[substat.id]);
        substat.value = Math.round(isPercent ? substatValueRaw * 100 : substatValueRaw);
      }
    }

    self.postMessage({ success: true, entry: build });
  } catch (error) {
    console.error(error);
  }
};
