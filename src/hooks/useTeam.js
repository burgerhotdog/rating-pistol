import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBuild } from '@/contexts';
import { GI, HSR, CHARACTER } from '@/data';
import { getMemberPreset, applyStoredBuild } from '@/utils';

const initMember = (gameId, builds, presetKey) => {
  const [memberId, presetIndex = 0] = presetKey.split('.');

  let member = getMemberPreset(gameId, memberId, presetIndex);

  if (memberId in builds) {
    member = applyStoredBuild(gameId, member, builds[memberId]);
  }

  return member;
};

const initTeam = (gameId, charId, builds) => {
  const character = CHARACTER[gameId][charId];
  const teamSize = (gameId === GI || gameId === HSR) ? 4 : 3;
  const teamPreset =
    character.presets?.[0]?.team ??
    [charId, ...Array(teamSize - 1).fill(null)];

  const members = teamPreset.map((presetKey) => presetKey
    ? initMember(gameId, builds, presetKey)
    : {});

  const rotation = {};

  return { members, rotation };
};

export const useTeam = () => {
  const { gameId, charId } = useParams();
  const builds = useBuild().getBuilds(gameId);
  const build = builds[charId];
  if (!build) throw new Error(`Init team for character with no build: ${charId}`);

  const [team, setTeam] = useState(() => initTeam(gameId, charId, builds));

  function updateTeam(index, member) {
    setTeam(({ members, rotation }) => ({
      members: members.with(index, member),
      rotation,
    }));
  }

  return { team, updateTeam };
};
