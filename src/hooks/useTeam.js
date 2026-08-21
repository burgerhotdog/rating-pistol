import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { GI, HSR, CHARACTER } from '@/data';
import { initMember } from '@/utils';
import { useBuilds } from './useBuilds';

export function useTeam() {
  const { gameId, charId } = useParams();
  const builds = useBuilds();

  return useState(() => {
    const charPresets = CHARACTER[gameId][charId].presets ?? [];
    const charPreset = charPresets[0] ?? {};
    const allyCount = (gameId === GI || gameId === HSR) ? 3 : 2;
    const teamPreset = charPreset.team ??
      [charId, ...Array(allyCount).fill(null)];

    return teamPreset.map((key) => initMember(key, gameId, builds));
  });
}
