import { WW, CHARACTER, WEAPON, ECHO } from '@/data';

export function getDefaultWeaponRank(gameId, weaponId) {
  const { quality } = WEAPON[gameId][weaponId];
  return quality === 5 ? 1 : 5;
}

export function getPresetSetCounts(gameId, charId, presetIndex = 0) {
  const preset = CHARACTER[gameId][charId].presets?.[presetIndex] ?? {};
  return preset.setCounts ?? {};
}

export function getMemberPreset(gameId, charId, presetIndex = 0) {
  const character = CHARACTER[gameId][charId];
  const { quality, presets = [] } = character;
  const preset = presets[presetIndex];
  if (!preset) return { id: charId };

  const member = {
    useUserBuild: false,
    id: charId,
    rank: quality === 5 ? 0 : 6,
    rotation: [],
  };

  if ('weaponId' in preset) member.weaponId = preset.weaponId;
  if ('weaponId' in member) member.weaponRank = getDefaultWeaponRank(gameId, member.weaponId);
  if ('setCounts' in preset) member.setCounts = preset.setCounts;
  if ('rotation' in preset) member.rotation.push(...preset.rotation);

  if ('mainEcho' in preset) {
    member.mainEcho = preset.mainEcho;
    const echo = ECHO[preset.mainEcho];
    if ('preset' in echo) {
      const { preset } = echo;
      const { rotation } = member;

      let insertAtIndex = rotation.length;

      if (preset.timing === 'beginning') {
        const firstRef = rotation[0] ?? '';
        const [category, actionIndex] = firstRef.split('.');
        const first = CHARACTER[WW][charId].skills[category]?.actions?.[actionIndex];

        insertAtIndex = first?.type === 'introSkill' ? 1 : 0;
      } else {
        const lastRef = rotation.at(-1) ?? '';
        const [category, actionIndex] = lastRef.split('.');
        const last = CHARACTER[WW][charId].skills[category]?.actions?.[actionIndex];

        if (last?.type === 'outroSkill') insertAtIndex = -1;
      }

      rotation.splice(insertAtIndex, 0, ...preset.rotation);
    }
  }

  if ('resonanceModes' in character) member.resonanceMode = character.resonanceModes[0];

  return member;
}
