import { Grid, Autocomplete, TextField, Paper, InputAdornment } from "@mui/material";
import { STATS } from "@data/static";
import { useState, useEffect } from "react";

const Substat = ({ gameId, pipe, setPipe, mainIndex, subIndex }) => {
  const [inputValue, setInputValue] = useState(pipe.data.equipList[mainIndex].statList[subIndex].value ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInputValue(pipe.data.equipList[mainIndex].statList[subIndex].value ?? "");
  }, [pipe.data.equipList[mainIndex].statList[subIndex].value]);

  const substatOptions = (subIndex) => {
    const selectedMainstat = pipe.data.equipList[mainIndex].stat;
    const selectedSubstats = pipe.data.equipList[mainIndex].statList
      .map((statObj) => statObj.stat)
      .filter((_, index) => index !== subIndex);
    
    return Object.keys(STATS[gameId]).filter((stat) => {
      const isSubstat = STATS[gameId][stat].value;
      const isNotMainstat = gameId === "ww" || stat !== selectedMainstat;
      const isNotDuplicate = !selectedSubstats.includes(stat);
      return isSubstat && isNotDuplicate && isNotMainstat;
    });
  };

  const handleStat = (newValue, subIndex) => {
    setPipe((prev) => ({
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

  const handleValue = (newValue, subIndex) => {
    setPipe((prev) => ({
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
                value: Number(newValue)
              };
            })
          };
        })
      }
    }));
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleSubmit = () => {
    if (!isNaN(inputValue)) {
      handleValue(inputValue, subIndex);
    } else {
      setInputValue(pipe.data.equipList[mainIndex].statList[subIndex].value ?? "");
    }
  };

  return (
    <Grid container spacing={1}>
      {/* Substat Key Dropdown */}
      <Grid size={8}>
        <Autocomplete
          value={pipe.data.equipList[mainIndex].statList[subIndex].stat}
          options={substatOptions(subIndex)}
          getOptionLabel={(id) => STATS[gameId][id]?.name || ""}
          onChange={(_, newValue) => handleStat(newValue, subIndex)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              const inputValue = e.target.value.toLowerCase();
              const options = substatOptions(subIndex).filter(option => 
                STATS[gameId][option]?.name.toLowerCase().includes(inputValue)
              );
              if (options.length > 0) {
                handleStat(options[0], subIndex);
                setOpen(false);
              }
            }
          }}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          renderInput={(params) => (
            <TextField {...params} label={"Substat"} />
          )}
          disabled={!pipe.data.equipList[mainIndex].stat}
        />
      </Grid>

      {/* Substat Value Input */}
      <Grid size={4}>
        <TextField
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          slotProps={{
            input: {
              endAdornment: STATS[gameId][pipe?.data.equipList[mainIndex].statList[subIndex].stat]?.percent && (
                <InputAdornment position="end">%</InputAdornment>
              ),
            },
          }}
          disabled={!pipe.data.equipList[mainIndex].statList[subIndex].stat}
        />
      </Grid>
    </Grid>
  )
};

export default Substat;
