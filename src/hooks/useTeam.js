import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBuild } from '@/contexts';
import { CHARACTERS, WEAPONS } from '@/data';
import { getSetCounts, formatRotation } from '@/utils';

const getTeamSize = (gameId) =>
  gameId === 'genshin-impact' || gameId === 'honkai-star-rail' ? 4 : 3;

const getDefaultCharacterRank = (gameId, characterId) => {
  const { quality } = CHARACTERS[gameId][characterId];
  return quality === 5 ? 0 : 6;
};

const getDefaultWeaponRank = (gameId, weaponId) => {
  const { quality } = WEAPONS[gameId][weaponId];
  return quality === 5 ? 1 : 5;
};

const normalizeMemberPreset = (gameId, rawMemberPreset) => {
  const overrides =
    typeof rawMemberPreset === 'string'
      ? { memberId: rawMemberPreset }
      : rawMemberPreset;

  const { defaults = {} } = CHARACTERS[gameId][overrides.memberId];

  return { ...defaults, ...overrides };
};

const createBlankMember = () => ({
  memberId: null,
  rank: null,
  weaponId: null,
  weaponRank: null,
  setCounts: {},
  rotation: [],
  useUserBuild: false,
});

function applyStoredBuild(gameId, member, storedBuild) {
  member.build = storedBuild;
  member.useUserBuild = true;

  if (storedBuild.rank != null) {
    member.rank = storedBuild.rank;
  }
  
  if (storedBuild.weaponId) {
    member.weaponId = storedBuild.weaponId;

    if (storedBuild.weaponRank) {
      member.weaponRank = storedBuild.weaponRank;
    } else {
      member.weaponRank = getDefaultWeaponRank(gameId, member.weaponId);
    }
  }

  if (storedBuild.equipList) {
    member.setCounts = getSetCounts(storedBuild.equipList);
  }
}

const initMember = (gameId, memberPreset, builds) => {
  const member = createBlankMember();

  member.memberId = memberPreset.memberId;
  member.rank = getDefaultCharacterRank(gameId, member.memberId);

  if (memberPreset.weaponId) {
    member.weaponId = memberPreset.weaponId;
    member.weaponRank = getDefaultWeaponRank(gameId, member.weaponId);
  }

  if (memberPreset.setCounts) {
    member.setCounts = { ...memberPreset.setCounts };
  }

  if (memberPreset.rotation) {
    member.rotation = formatRotation(member.memberId, memberPreset.rotation);
  }

  const storedBuild = builds[member.memberId];
  if (storedBuild) {
    applyStoredBuild(gameId, member, storedBuild);
  }

  return member;
};

const initTeam = (gameId, characterId, builds) => {
  const teamSize = getTeamSize(gameId);
  const teamPreset =
    CHARACTERS[gameId][characterId].defaults?.team ??
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
