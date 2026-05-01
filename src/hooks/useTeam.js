import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBuild } from '@/contexts';
import { CHARACTERS } from '@/data';
import { getMember } from '@/utils';

function createMember(gameId, member, build) {
  if (!member) {
    return {
      memberId: null,
      weaponId: null,
      setCounts: {},
      rotation: [],
      build: {},
    };
  }

  if (typeof member === 'string') {
    return { ...getMember(gameId, member), build };
  }

  return { ...getMember(gameId, member.memberId), ...member, build };
}

export function useTeam() {
  const { gameId, characterId } = useParams();
  const build = useBuild().getBuilds(gameId)[characterId];
  const teamSize = (gameId === 'genshin-impact' || gameId === 'honkai-star-rail') ? 4 : 3;
  const defaultTeam = CHARACTERS[gameId][characterId].defaults?.team ?? [characterId, ...Array(teamSize - 1).fill(null)];

  const [team, setTeam] = useState(defaultTeam.map(member => createMember(gameId, member, (member === characterId || member.memberId === characterId) ? build : {})));

  function updateTeam(index, member) {
    if (index < 0 || index >= team.length) return;
    setTeam(prev => prev.with(index, member));
  }

  function replaceTeam(newTeam) {
    setTeam([...newTeam]);
  }

  return { team, updateTeam, replaceTeam };
}
