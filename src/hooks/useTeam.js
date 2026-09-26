import { useState } from 'react';
import { useData, usePageParams } from '@/hooks';
import { initMember } from '@/utils';
import { useBuilds } from './useBuilds';

export function useTeam() {
  const { gameId, charId } = usePageParams();
  const charData = useData('character')[charId];
  const { maxMembers } = useData('misc');
  const builds = useBuilds();

  return useState(() => {
    const teamPreset = charData.teamPreset ?? [charId];

    const presets = [
      ...teamPreset,
      ...Array(maxMembers - teamPreset.length).fill(null),
    ];

    return presets.map((presetSpec) => {
      if (typeof presetSpec === 'number') {
        const memberId = presetSpec;
        return initMember(gameId, memberId, builds[memberId]);
      }

      if (presetSpec) {
        const memberId = presetSpec.id;
        return initMember(gameId, memberId, builds[memberId], presetSpec);
      }

      return initMember(gameId);
    });
  });
}
