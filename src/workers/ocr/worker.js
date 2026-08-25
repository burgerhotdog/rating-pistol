import { createWorker } from 'tesseract.js';
import { WW } from '@/data';
import { initBuild } from '@/utils';
import { validateBitmap } from './validateBitmap';
import {
  getRank,
  getCost,
  getSetId,
  getEchoId,
} from './ocrImage';
import {
  ocrId,
  ocrWeaponId,
  ocrMainstatId,
  ocrMainstatValue,
  ocrMainstatSubValue,
  ocrSubstat,
} from './ocrText';

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
    // build.level =
    build.rank = getRank(imageBitmap);
    build.weaponId = await ocrWeaponId(imageBitmap, ocrWorker);
    // build.weaponLevel =
    // build.weaponRank =

    for (let equipIndex = 0; equipIndex < 5; equipIndex++) {
      const equip = build.equipList[equipIndex];

      const cost = getCost(imageBitmap, equipIndex);
      equip.cost = cost;
      equip.setId = await getSetId(imageBitmap, equipIndex);
      equip.echoId = await getEchoId(imageBitmap, equipIndex, equip.setId, cost);

      equip.mainstatId = await ocrMainstatId(imageBitmap, ocrWorker, equipIndex, cost);
      equip.mainstatValue = await ocrMainstatValue(imageBitmap, ocrWorker, equipIndex);
      equip.mainstatSubId = cost === 1 ? 'hp' : 'atk';
      equip.mainstatSubValue = await ocrMainstatSubValue(imageBitmap, ocrWorker, equipIndex);

      for (let lineIndex = 0; lineIndex < 5; lineIndex++) {
        const substat = equip.substats[lineIndex];

        const { id, value } = await ocrSubstat(imageBitmap, ocrWorker, equipIndex, lineIndex);
        substat.id = id;
        substat.value = value;
      }
    }

    self.postMessage({ success: true, entry: build });
  } catch (error) {
    console.error(error);
  }
};
