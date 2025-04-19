import { useState, useEffect, useMemo } from "react";
import { Grid, Autocomplete, TextField, Paper, InputAdornment } from "@mui/material";
import { STAT_DATA } from "@data";

const Substat = ({ gameId, equipList, setEquipList, mainIndex, subIndex }) => {
  const { stat: mainstat, statList } = equipList[mainIndex];
  const { stat, value } = statList[subIndex];
  const [rawValue, setRawValue] = useState(String(value ?? ""));

  useEffect(() => setRawValue(String(value ?? "")), [value]);

  const substatOptions = useMemo(() => {
    const selectedSubstats = statList
      .map(({ stat }) => stat)
      .filter((_, index) => index !== subIndex);
    
    return Object.entries(STAT_DATA[gameId])
      .filter(([stat, { subValue }]) => {
        const isSubstat = Boolean(subValue);
        const isNotMainstat = gameId === "ww" || stat !== mainstat;
        const isNotDuplicate = !selectedSubstats.includes(stat);
        return isSubstat && isNotMainstat && isNotDuplicate;
      })
      .map(([stat]) => stat);
  }, [gameId, mainIndex, subIndex, mainstat, statList]);

  const handleStat = (newValue, subIndex) =>
    setEquipList((prev) => {
      const newList = structuredClone(prev);
      newList[mainIndex].statList[subIndex].stat = newValue;
      newList[mainIndex].statList[subIndex].value = null;
      return newList;
    });

  const handleValue = () => {
    if (isNaN(rawValue)) {
      setRawValue(String(value ?? ""));
      return;
    }

    const newValue = Number(rawValue);

    setEquipList((prev) => {
      const newList = structuredClone(prev);
      newList[mainIndex].statList[subIndex].value = newValue;
      return newList;
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid size={8}>
        <Autocomplete
          value={stat ?? ""}
          options={substatOptions}
          getOptionLabel={(id) => STAT_DATA[gameId][id]?.name || ""}
          onChange={(_, newValue) => handleStat(newValue, subIndex)}
          slots={{
            paper: ({ children }) => (
              <Paper elevation={3}>
                {children}
              </Paper>
            ),
          }}
          renderInput={(params) => (
            <TextField {...params} label={"Substat"} />
          )}
          disabled={!mainstat}
        />
      </Grid>

      <Grid size={4}>
        <TextField
          value={rawValue}
          onChange={(e) => setRawValue(e.target.value)}
          onBlur={handleValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleValue();
          }}
          slotProps={{
            input: {
              endAdornment: STAT_DATA[gameId][stat]?.percent && (
                <InputAdornment position="end">%</InputAdornment>
              ),
            },
          }}
          disabled={!stat}
        />
      </Grid>
    </Grid>
  )
};

export default Substat;
