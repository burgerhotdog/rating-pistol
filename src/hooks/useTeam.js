import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBuild } from '@/contexts';
import { CHARACTERS } from '@/data';
import { getSetCounts } from '@/utils';

const NULL_MEMBER = {
  memberId: null,
  weaponId: null,
  setCounts: {},
  rotation: [],
};

function formatRotation(memberId, rotation) {
  if (!rotation) throw new Error('attempting to format undefined rotation');
  return rotation.map(key => {
    if (key.split('-').length === 3) return key;
    return `${memberId}-${key}`;
  });
}

export function useTeam() {
  const { gameId, characterId } = useParams();
  const teamSize = ['genshin-impact', 'honkai-star-rail'].includes(gameId) ? 4 : 3;
  const build = useBuild().getBuilds(gameId)[characterId];
  if (!build) throw new Error(`build does not exist for characterId ${characterId}`);

  const defaultTeam = CHARACTERS[gameId][characterId].defaults?.team ?? [characterId, ...Array(teamSize - 1).fill(null)];
  function initTeam(defaultTeam) {
    const mappedTeam = defaultTeam.map(item => {
      // null case
      if (!item) {
        return { ...NULL_MEMBER };
      }

      // map case
      if (item.memberId) {
        const { defaults = {} } = CHARACTERS[gameId][item.memberId];
        return {
          memberId: item.memberId,
          weaponId: item.weaponId ?? defaults.weaponId ?? NULL_MEMBER.weaponId,
          setCounts: item.setCounts ?? defaults.setCounts ?? NULL_MEMBER.setCounts,
          rotation: formatRotation(item.memberId, item.rotation ?? defaults.rotation ?? NULL_MEMBER.rotation),
        };
      }

      // string case
      const { defaults = {} } = CHARACTERS[gameId][item];
      return {
        memberId: item,
        weaponId: defaults.weaponId ?? NULL_MEMBER.weaponId,
        setCounts: defaults.setCounts ?? NULL_MEMBER.setCounts,
        rotation: formatRotation(item, defaults.rotation ?? NULL_MEMBER.rotation),
      };
    });

    // add build to current character
    return mappedTeam.map(member => {
      if (member.memberId !== characterId) return { ...member };
      return {
        ...member,
        weaponId: build.weaponId,
        setCounts: getSetCounts(build.equipList),
        build,
      };
    });
  }

  const [team, setTeam] = useState(initTeam(defaultTeam));

  function updateTeam(index, member) {
    if (index < 0 || index >= team.length) return;
    setTeam(prev => prev.with(index, member));
  }

  function replaceTeam(newTeam) {
    setTeam([...newTeam]);
  }

  return { team, updateTeam, replaceTeam };
}
