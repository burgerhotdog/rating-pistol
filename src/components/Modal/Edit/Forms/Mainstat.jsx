import { useMemo } from 'react';
import { Autocomplete, TextField, Paper } from '@mui/material';
import { INFO_DATA, STAT_DATA } from '@data';

const Mainstat = ({ gameId, equipList, setEquipList, mainIndex }) => {
  const mainstatOptions = useMemo(() =>
    Object.keys(STAT_DATA[gameId])
      .filter((stat) =>
        STAT_DATA[gameId][stat].mainChance?.[mainIndex]
      ), [gameId, mainIndex]);

  const handleMainstat = (newValue) =>
    setEquipList((prev) => {
      const newList = structuredClone(prev);
      newList[mainIndex].stat = newValue;
      newList[mainIndex].statList = Array(INFO_DATA[gameId].SUB_LEN).fill()
        .map(() => ({ stat: null, value: null }));
      return newList;
    });

  return (
    <Autocomplete
      value={equipList[mainIndex].stat}
      options={mainstatOptions}
      getOptionLabel={(stat) => STAT_DATA[gameId][stat]?.name ?? ''}
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
