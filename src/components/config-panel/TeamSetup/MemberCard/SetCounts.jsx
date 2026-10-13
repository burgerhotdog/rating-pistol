import { useMemo } from 'react';
import { useData } from '@/hooks';
import { MultiAutocomplete } from '../../../Autocomplete';

const SetCounts = ({ memberId, setCounts = {}, onChange }) => {
  const setDatas = useData('set');
  const { maxEquips } = useData('misc');

  const usedEquips = Object.values(setCounts).reduce((acc, count) => acc + count, 0);
  const maxBonus = maxEquips - usedEquips;

  const options = useMemo(() => {
    const options = [];

    for (let bonus = maxBonus; bonus > 0; bonus--) {
      for (const setData of Object.values(setDatas)) {
        if (!setData.bonuses.includes(bonus)) continue;
        options.push({ ...setData, bonus });
      }
    }

    return options.sort((a, b) =>
      b.bonus - a.bonus ||
      b.version - a.version ||
      b.id - a.id
    );
  }, [setDatas, maxBonus]);

  const value = useMemo(
    () => Object.entries(setCounts)
      .map(([id, bonus]) => ({ id, bonus,
        name: setDatas[id].name,
        icon: setDatas[id].icon,
      }))
      .sort((a, b) => Number(b.id) - Number(a.id)),
    [setDatas, setCounts],
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
