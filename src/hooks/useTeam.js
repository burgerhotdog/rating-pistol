import { useEffect, useMemo, useState } from "react";
import { CHARACTERS } from "@/data";

function getDefaultRotation(gameId, charId) {
  const calcsList = CHARACTERS[gameId]?.[charId]?.calcs ?? [];
  const defaultCalc = calcsList.find(calc => Array.isArray(calc?.rotation));
  return defaultCalc ? [...defaultCalc.rotation] : [];
}

function buildMember(gameId, charId) {
  if (!charId) return null;
  const preset = CHARACTERS[gameId]?.[charId]?.preset;
  return {
    characterId: charId,
    weaponId: preset?.weaponId ?? null,
    setId: preset?.setBonuses?.[0]?.[0] ?? null,
    rotation: getDefaultRotation(gameId, charId),
  };
}

export function useTeam(gameId, characterId, calcsIndex) {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const size = (gameId === "genshin-impact" || gameId === "honkai-star-rail") ? 4 : 3;
    const defaultTeam = CHARACTERS[gameId][characterId]?.calcs?.[calcsIndex]?.team;

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
