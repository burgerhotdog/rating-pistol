import { useMemo } from 'react';
import { Autocomplete, TextField, Paper } from '@mui/material';
import { INFO_DATA, STAT_DATA } from '@data';

const Mainstat = ({ gameId, equipList, setEquipList, mainIndex }) => {
  const mainstatOptions = useMemo(() =>
    Object.keys(STAT_DATA[gameId])
      .filter((statId) =>
        STAT_DATA[gameId][statId].mainChance?.[mainIndex]
      ), [gameId, mainIndex]);

  const handleMainstat = (newValue) =>
    setEquipList((prev) => {
      const newList = structuredClone(prev);
      newList[mainIndex].mainStatId = newValue;
      newList[mainIndex].subStatList = Array(INFO_DATA[gameId].NUM_SUBSTATS).fill()
        .map(() => ({ stat: null, value: null }));
      return newList;
    });

  return (
    <Autocomplete
      value={equipList[mainIndex].mainStatId}
      options={mainstatOptions}
      getOptionLabel={(statId) => STAT_DATA[gameId][statId]?.name ?? ''}
      onChange={(_, newValue) => handleMainstat(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Mainstat" />
      )}
      slots={{
        paper: ({ children }) => (
          <Paper elevation={3}>
            {children}
          </Paper>
        )
      }}
      fullWidth
    />
  )
};

export default Mainstat;
