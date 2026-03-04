import { useState, useEffect, useMemo } from 'react';
import { Box, Autocomplete, TextField, Paper, InputAdornment } from '@mui/material';
import { STAT_DATA } from '@data';

const Substat = ({ gameId, equipList, setEquipList, mainIndex, subIndex }) => {
  const { mainStatId: mainstat, subStatList } = equipList[mainIndex];
  const { subStatId, value } = subStatList[subIndex];
  const [rawValue, setRawValue] = useState(String(value ?? ''));

  useEffect(() => setRawValue(String(value ?? '')), [value]);

  const substatOptions = useMemo(() => {
    const selectedSubstats = subStatList
      .map(({ subStatId }) => subStatId)
      .filter((_, index) => index !== subIndex);
    
    return Object.entries(STAT_DATA[gameId])
      .filter(([statId, { subValue }]) => {
        const isSubstat = Boolean(subValue);
        const isNotMainstat = gameId === 'wuthering-waves' || statId !== mainstat;
        const isNotDuplicate = !selectedSubstats.includes(statId);
        return isSubstat && isNotMainstat && isNotDuplicate;
      })
      .map(([statId]) => statId);
  }, [gameId, mainIndex, subIndex, mainstat, subStatList]);

  const handleStat = (newValue, subIndex) =>
    setEquipList((prev) => {
      const newList = structuredClone(prev);
      newList[mainIndex].subStatList[subIndex].subStatId = newValue;
      newList[mainIndex].subStatList[subIndex].value = null;
      return newList;
    });

  const handleValue = () => {
    if (isNaN(rawValue)) {
      setRawValue(String(value ?? ''));
      return;
    }

    const newValue = Number(rawValue);

    setEquipList((prev) => {
      const newList = structuredClone(prev);
      newList[mainIndex].subStatList[subIndex].value = newValue;
      return newList;
    });
  };

  return (
    <Box display="flex" gap={1}>
      <Box flex="2 1 0">
        <Autocomplete
          value={subStatId}
          options={substatOptions}
          getOptionLabel={(statId) => STAT_DATA[gameId][statId]?.name ?? ''}
          onChange={(_, newValue) => handleStat(newValue, subIndex)}
          slots={{
            paper: ({ children }) => (
              <Paper elevation={3}>
                {children}
              </Paper>
            ),
          }}
          renderInput={(params) => (
            <TextField {...params} label="Substat" />
          )}
          disabled={!mainstat}
        />
      </Box>

      <Box flex="1 1 0">
        <TextField
          value={rawValue}
          onChange={(e) => setRawValue(e.target.value)}
          onBlur={handleValue}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleValue();
          }}
          slotProps={{
            input: {
              endAdornment: STAT_DATA[gameId][subStatId]?.showPercent && (
                <InputAdornment position="end">%</InputAdornment>
              ),
            },
          }}
          disabled={!subStatId}
        />
      </Box>
    </Box>
  )
};

export default Substat;
