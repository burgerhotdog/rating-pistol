import { CHARACTER } from '@/data';

export function getPresetSetCounts(gameId, charId, presetIndex = 0) {
  const preset = CHARACTER[gameId][charId].presets?.[presetIndex] ?? {};
  return preset.setCounts ?? {};
}
