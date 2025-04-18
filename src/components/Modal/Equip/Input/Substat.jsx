import { useState, useEffect } from "react";
import { Grid, Autocomplete, TextField, Paper, InputAdornment } from "@mui/material";
import { STAT_DATA } from "@data";

const Substat = ({ gameId, modalPipe, setModalPipe, mainIndex, subIndex }) => {
  const [inputValue, setInputValue] = useState(String(modalPipe.data.equipList[mainIndex].statList[subIndex].value ?? ""));

  useEffect(() => {
    setInputValue(String(modalPipe.data.equipList[mainIndex].statList[subIndex].value ?? ""));
  }, [modalPipe.data.equipList[mainIndex].statList[subIndex].value]);

  const substatOptions = (subIndex) => {
    const selectedMainstat = modalPipe.data.equipList[mainIndex].stat;
    const selectedSubstats = modalPipe.data.equipList[mainIndex].statList
      .map((statObj) => statObj.stat)
      .filter((_, index) => index !== subIndex);
    
    return Object.keys(STAT_DATA[gameId]).filter((stat) => {
      const isSubstat = STAT_DATA[gameId][stat].value;
      const isNotMainstat = gameId === "ww" || stat !== selectedMainstat;
      const isNotDuplicate = !selectedSubstats.includes(stat);
      return isSubstat && isNotDuplicate && isNotMainstat;
    });
  };

  const handleStat = (newValue, subIndex) => {
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, equipIndex) => {
          if (equipIndex !== mainIndex) return equipObj;
          return {
            ...equipObj,
            statList: equipObj.statList.map((statObj, statIndex) => {
              if (statIndex !== subIndex) return statObj;
              return {
                stat: String(newValue),
                value: null,
              };
            }),
          };
        }),
      },
    }));
  };

  const handleBlur = () => {
    if (isNaN(inputValue)) {
      setInputValue(String(modalPipe.data.equipList[mainIndex].statList[subIndex].value ?? ""));
      return;
    }

    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, equipIndex) => {
          if (equipIndex !== mainIndex) return equipObj;
          return {
            ...equipObj,
            statList: equipObj.statList.map((statObj, statIndex) => {
              if (statIndex !== subIndex) return statObj;
              return {
                ...statObj,
                value: Number(inputValue)
              };
            })
          };
        })
      }
    }));
  };

  return (
    <Grid container spacing={1}>
      <Grid size={8}>
        <Autocomplete
          value={modalPipe.data.equipList[mainIndex].statList[subIndex].stat}
          options={substatOptions(subIndex)}
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
          disabled={!modalPipe.data.equipList[mainIndex].stat}
        />
      </Grid>

      <Grid size={4}>
        <TextField
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleBlur();
          }}
          slotProps={{
            input: {
              endAdornment: STAT_DATA[gameId][modalPipe.data.equipList[mainIndex].statList[subIndex].stat]?.percent && (
                <InputAdornment position="end">%</InputAdornment>
              ),
            },
          }}
          disabled={!modalPipe.data.equipList[mainIndex].statList[subIndex].stat}
        />
      </Grid>
    </Grid>
  )
};

export default Substat;
