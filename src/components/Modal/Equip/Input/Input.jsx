import React from "react";
import {
  Grid,
  Box,
  Card,
  Divider,
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material";
import SET_ASSETS from "@assets/dynamic/set";
import { STATS } from "@data/static";
import SETS from "@data/dynamic/sets";
import Mainstat from "./Mainstat";
import SetId from "./SetId";

const Input = ({ gameId, pipe, setPipe, mainIndex }) => {
  const handleSubstat = (newValue, subIndex, attribute) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, equipIndex) => 
          equipIndex === mainIndex
            ? {
              ...equipObj,
              statList: equipObj.statList.map((statObj, statIndex) =>
                statIndex === subIndex
                  ? {
                    ...statObj,
                    [attribute]: Number(newValue),
                    ...attribute === "stat" ? { "value": null } : {},
                  }
                  : statObj
              ),
            }
            : equipObj
        ),
      },
    }));
  };

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

  return (
    <Card sx={{ width: 300, p: 2 }}>
      <Box sx={{ height: 300 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <SetId
            gameId={gameId}
            pipe={pipe}
            setPipe={setPipe}
            mainIndex={mainIndex}
          />
        </Grid>

        <Grid size={12}>
          <Mainstat
            gameId={gameId}
            pipe={pipe}
            setPipe={setPipe}
            mainIndex={mainIndex}
          />
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        {[0, 1, 2, 3, ...(gameId === "WW" ? [4] : [])].map((subIndex) => (
          <React.Fragment key={`${mainIndex}-${subIndex}`}>
            {/* Substat Key Dropdown */}
            <Grid size={8}>
              <Autocomplete
                value={pipe.data.equipList[mainIndex].statList[subIndex].stat}
                options={substatOptions(subIndex)}
                getOptionLabel={(id) => STATS[gameId][id]?.name || ""}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "stat")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Substat"}
                  />
                )}
                disabled={!pipe.data.equipList[mainIndex].stat}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={4}>
              <TextField
                value={pipe.data.equipList[mainIndex].statList[subIndex].value ?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                  const isLessThanMax = Number(newValue) <= (STATS[gameId][pipe.data.equipList[mainIndex].statList[subIndex].stat]?.value * (gameId === "ww" ? 1 : 6));
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, "value");
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
          </React.Fragment>
        ))}
      </Grid>
      </Box>
    </Card>
  );
};

export default Input;
