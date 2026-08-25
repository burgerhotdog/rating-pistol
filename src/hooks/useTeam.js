import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CHARACTER } from '@/data';
import { useData } from '@/hooks';
import { initMember } from '@/utils';
import { useBuilds } from './useBuilds';

export function useTeam() {
  const { gameId, charId } = useParams();
  const builds = useBuilds();
  const { maxMembers } = useData('misc');

  return useState(() => {
    const charPresets = CHARACTER[gameId][charId].presets ?? [];
    const charPreset = charPresets[0] ?? {};
    const teamPreset = charPreset.team ??
      [charId, ...Array(maxMembers - 1).fill(null)];

    return teamPreset.map((key) => initMember(key, gameId, builds));
  });
}
