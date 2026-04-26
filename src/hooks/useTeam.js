import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { CHARACTERS } from '@/data';
import { getMember } from '@/utils';

function createMember(gameId, member) {
  if (!member) {
    return {
      memberId: null,
      weaponId: null,
      setCounts: {},
      rotation: [],
    };
  }

  if (typeof member === 'string') {
    return getMember(gameId, member);
  }

  return { ...getMember(gameId, member.memberId), ...member };
}

export function useTeam() {
  const { gameId, characterId } = useParams();
  const teamSize = (gameId === 'genshin-impact' || gameId === 'honkai-star-rail') ? 4 : 3;
  const defaultTeam = CHARACTERS[gameId][characterId].defaults?.team ?? [characterId, ...Array(teamSize - 1).fill(null)];

  const [team, setTeam] = useState(defaultTeam.map(member => createMember(gameId, member)));

  function updateTeam(index, member) {
    if (index < 0 || index >= team.length) return;
    setTeam(prev => prev.with(index, member));
  }

  function replaceTeam(newTeam) {
    setTeam([...newTeam]);
  }

  return { team, updateTeam, replaceTeam };
}
