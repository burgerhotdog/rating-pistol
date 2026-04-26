import { useEffect, useMemo, useState } from "react";
import { CHARACTERS } from "@/data";

function getDefaultRotation(gameId, characterId) {
  return CHARACTERS[gameId]?.[characterId]?.preset?.rotation ?? [];
}

function buildMember(gameId, charId) {
  if (!charId) return null;
  const preset = CHARACTERS[gameId]?.[charId]?.preset;
  const setBonuses = (preset?.setBonuses ?? []).map(([setId, pieces]) => [String(setId), Number(pieces)]);
  return {
    characterId: charId,
    weaponId: preset?.weaponId ?? null,
    setId: setBonuses[0]?.[0] ?? null,
    setBonuses,
    rotation: getDefaultRotation(gameId, charId),
  };
}

export function useTeam(gameId, characterId, calcsIndex) {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const size = (gameId === "genshin-impact" || gameId === "honkai-star-rail") ? 4 : 3;
    const defaultTeam = CHARACTERS[gameId][characterId]?.preset?.team;

    const charIds = defaultTeam
      ? [...defaultTeam, ...new Array(size - 1).fill(null)].slice(0, size)
      : [characterId, ...new Array(size - 1).fill(null)];

    setTeam(charIds.map(id => buildMember(gameId, id)));
  }, [gameId, characterId, calcsIndex]);

  function updateTeam(index, member) {
    if (index < 0 || index >= team.length) return;
    setTeam(prev => prev.with(index, member));
  }

  function replaceTeam(newTeam) {
    setTeam([...newTeam]);
  }

  const teamIds = useMemo(() => team.map(m => m?.characterId ?? null), [team]);

  return { team, teamIds, updateTeam, replaceTeam };
}
