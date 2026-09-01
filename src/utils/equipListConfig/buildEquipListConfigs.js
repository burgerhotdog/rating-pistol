import { SUBSTAT } from '@/data';
import { getMainstatConfigKey } from './getMainstatConfigKey';
import { sumSubstatRolls } from './sumSubstatRolls';

export function buildEquipListConfigs(gameId, trials) {
  const equipListConfigs = {};

  for (const trial of trials) {
    const mainstatConfigKey = getMainstatConfigKey(gameId, trial.equipList);
    equipListConfigs[mainstatConfigKey] ??= {
      trialCount: 0,
      substatRolls: Object.fromEntries(
        Object.keys(SUBSTAT[gameId])
          .map((id) => [id, []])
      ),
    };
    const config = equipListConfigs[mainstatConfigKey];

    config.trialCount++;

    const substatRolls = sumSubstatRolls(gameId, trial.equipList, true);
    for (const [id, rolls] of Object.entries(config.substatRolls)) {
      rolls.push(substatRolls[id] ?? 0);
    }
  }

  return equipListConfigs;
}

export function mergeEquipListConfigs(partialEquipListConfigsList) {
  const equipListConfigs = {};

  for (const partialEquipListConfigs of partialEquipListConfigsList) {
    for (const [mainstatConfigKey, sourceConfig] of Object.entries(partialEquipListConfigs)) {
      const config = equipListConfigs[mainstatConfigKey];

      if (!config) {
        equipListConfigs[mainstatConfigKey] = structuredClone(sourceConfig);
        continue;
      }

      config.trialCount += sourceConfig.trialCount;
      for (const [id, rolls] of Object.entries(sourceConfig.substatRolls)) {
        config.substatRolls[id].push(...rolls);
      }
    }
  }

  return equipListConfigs;
}

