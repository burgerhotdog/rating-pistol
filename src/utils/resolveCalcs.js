function getMemberId(member) {
  return typeof member === 'string' ? member : member?.characterId ?? null;
}

export function getTeamMember(team, characterId) {
  if (!Array.isArray(team)) return null;
  return team.find(member => getMemberId(member) === characterId) ?? null;
}

export function resolveCalcsWithTeamRotation(characterId, calcs, team) {
  if (!calcs) return calcs;

  const teamMember = getTeamMember(team, characterId);
  const teamRotation = teamMember?.rotation;

  if (!Array.isArray(teamRotation)) return calcs;

  return {
    ...calcs,
    rotation: [...teamRotation],
  };
}