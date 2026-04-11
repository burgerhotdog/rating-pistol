import { useEffect, useState } from "react";
import { CHARACTERS } from "@/data";

export function useTeam(gameId, characterId, criteriaIndex) {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const size = (gameId === "genshin-impact" || gameId === "honkai-star-rail") ? 4 : 3;
    const defaultTeam = CHARACTERS[gameId][characterId]?.criteria?.[criteriaIndex]?.team;

    const newTeam = defaultTeam
      ? [...defaultTeam, ...new Array(size - 1).fill(null)].slice(0, size)
      : [characterId, ...new Array(size - 1).fill(null)];

    setTeam(newTeam);
  }, [gameId, characterId, criteriaIndex]);

  function updateTeam(index, id) {
    if (index < 0 || index >= team.length) return;
    setTeam(prev => prev.with(index, id));
  }

  function replaceTeam(newTeam) {
    setTeam([...newTeam]);
  }

  return { team, updateTeam, replaceTeam };
}
