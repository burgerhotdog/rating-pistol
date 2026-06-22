import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBuild } from '@/contexts';
import { CHARACTER } from '@/data';
import { getMember, getDefaultWeaponRank, applyStoredBuild } from '@/utils';

const getTeamSize = (gameId) =>
  gameId === 'genshin-impact' || gameId === 'honkai-star-rail' ? 4 : 3;

const normalizeMemberPreset = (gameId, rawMemberPreset) => {
  const overrides =
    typeof rawMemberPreset === 'string'
      ? { id: rawMemberPreset }
      : rawMemberPreset;

  const { defaults = {} } = CHARACTER[gameId][overrides.id];

  return { ...defaults, ...overrides };
};

const createBlankMember = () => ({
  id: null,
  rank: null,
  weaponId: null,
  weaponRank: null,
  setCounts: {},
  rotation: [],
  useUserBuild: false,
});

const initMember = (gameId, memberPreset, builds) => {
  let member = getMember(gameId, memberPreset.id);

  if (memberPreset.weaponId) {
    member.weaponId = memberPreset.weaponId;
    member.weaponRank = getDefaultWeaponRank(gameId, memberPreset.weaponId);
  }

  if (memberPreset.setCounts) {
    member.setCounts = { ...memberPreset.setCounts };
  }

  if (memberPreset.rotation) {
    member.rotation = [...memberPreset.rotation];
  }

  const storedBuild = builds[member.id];
  if (storedBuild) {
    member = applyStoredBuild(gameId, member, storedBuild);
  }

  return member;
};

const initTeam = (gameId, characterId, builds) => {
  const teamSize = getTeamSize(gameId);
  const teamPreset =
    CHARACTER[gameId][characterId].defaults?.team ??
    [characterId, ...Array(teamSize - 1).fill(null)];
  
  return teamPreset.map(rawMemberPreset => {
    if (rawMemberPreset == null) return createBlankMember();

    const memberPreset = normalizeMemberPreset(gameId, rawMemberPreset);
    return initMember(gameId, memberPreset, builds);
  });
};

export const useTeam = () => {
  const { gameId, characterId } = useParams();
  const builds = useBuild().getBuilds(gameId);
  const build = builds[characterId];

  if (!build) {
    throw new Error(`Attempting to init team for character with no build: ${characterId}`);
  }

  const [team, setTeam] = useState(() => initTeam(gameId, characterId, builds));

  function updateTeam(index, member) {
    if (index < 0 || index >= team.length) return;
    setTeam(prev => prev.with(index, member));
  }

  function replaceTeam(newTeam) {
    setTeam([...newTeam]);
  }

  return { team, updateTeam, replaceTeam };
};
