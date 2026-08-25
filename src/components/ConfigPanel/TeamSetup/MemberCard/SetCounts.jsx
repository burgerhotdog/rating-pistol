import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { GI, WW } from '@/data';
import { useData } from '@/hooks';
import { MultiAutocomplete } from '../../../Autocomplete';

const SetCounts = ({ memberId, setCounts = {}, onChange }) => {
  const { gameId } = useParams();
  const totalPieces = gameId === GI || gameId === WW ? 5 : 6;
  const numUsedPieces = Object.values(setCounts).reduce((acc, count) => acc + count, 0);
  const maxBonus = totalPieces - numUsedPieces;

  const setData = useData('set');
  const options = useMemo(() => {
    const options = [];
    for (let bonus = maxBonus; bonus > 0; bonus--) {
      for (const { name, version, id, icon, bonuses } of Object.values(setData)) {
        if (!bonuses.includes(bonus)) continue;
        options.push({ id, bonus, version, name, icon });
      }
    }

    return options.sort((a, b) =>
      b.bonus - a.bonus ||
      b.version - a.version ||
      Number(b.id) - Number(a.id)
    );
  }, [setData, maxBonus]);

  const value = useMemo(
    () => Object.entries(setCounts)
      .map(([id, bonus]) => ({ id, bonus,
        name: setData[id].name,
        icon: setData[id].icon,
      }))
      .sort((a, b) => Number(b.id) - Number(a.id)),
    [setData, setCounts],
  );

  const handleChange = (newValue) => {
    const nextCounts = { ...setCounts };
    const chosenIds = new Set(newValue.map((option) => option.id));

    // Removed sets: chip was deselected.
    for (const setId of Object.keys(nextCounts)) {
      if (!chosenIds.has(setId)) delete nextCounts[setId];
    }
    // Added/changed sets: last write wins if two tiers for the same set
    // were somehow both in newValue.
    for (const option of newValue) {
      nextCounts[option.id] = option.bonus;
    }

    onChange(nextCounts);
  };

  return (
    <MultiAutocomplete
      options={options}
      groupBy={(option) => option.bonus}
      getOptionKey={(option) => `${option.id}-${option.bonus}`}
      value={value}
      onChange={handleChange}
      label="Set Bonuses"
      disabled={!memberId}
    />
  );
};

export default SetCounts;
