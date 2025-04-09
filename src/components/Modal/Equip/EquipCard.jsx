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
import STATS from "@data/static/stats";
import SETS from "@data/dynamic/sets";

const EquipCard = ({ gameId, pipe, setPipe, mainIndex }) => {
  const handleSet = (newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => 
          index === mainIndex
            ? {
              ...equipObj,
              setId: newValue,
            }
            : equipObj
        ),
      },
    }));
  };

  const handleMainstat = (newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => 
          index === mainIndex
            ? {
              ...equipObj,
              stat: newValue,
              statMap: {
                0: { stat: null, value: null },
                1: { stat: null, value: null },
                2: { stat: null, value: null },
                3: { stat: null, value: null },
                ...(gameId === "ww"
                  ? { 4: { stat: null, value: null } }
                  : {}),
              },
            }
            : equipObj
        ),
      },
    }));
  };

  const handleSubstat = (newValue, subIndex, attribute) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => 
          index === mainIndex
            ? {
              ...equipObj,
              statMap: {
                ...equipObj.statMap,
                [subIndex]: {
                  ...equipObj.statMap[subIndex],
                  [attribute]: newValue,
                  ...attribute === "stat" ? { "value": null } : {},
                },
              },
            }
            : equipObj
        ),
      },
    }));
  };

  const mainstatOptions = Object.keys(STATS[gameId]).filter(
    (stat) => STATS[gameId][stat].index?.includes(mainIndex)
  );

  const substatOptions = (subIndex) => {
    const selectedMainstat = pipe.data.equipList[mainIndex].stat;
    const selectedSubstats = Object.entries(pipe.data.equipList[mainIndex].statMap || {})
      .map(([, substatObj]) => substatObj.stat)
      .filter((_, idx) => idx !== subIndex);
    
    return Object.keys(STATS[gameId]).filter((stat) => {
      const isSubstat = STATS[gameId][stat].value;
      const isNotMainstat = gameId === "ww" || stat !== selectedMainstat;
      const isNotDuplicate = !selectedSubstats.includes(stat);
      return isSubstat && isNotDuplicate && isNotMainstat;
    });
  };

  const setOptions = () => {
    return Object.keys(SETS[gameId])
      .filter(id => 
        gameId === "hsr"
          ? mainIndex <= 3
            ? SETS[gameId][id].type === "Relic"
            : SETS[gameId][id].type === "Planar" : true)
      .sort((a, b) => {
        const rarityA = SETS[gameId][a].rarity;
        const rarityB = SETS[gameId][b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : SETS[gameId][a].name.localeCompare(SETS[gameId][b].name);
      });
  };

  return (
    <Card sx={{ width: 300, p: 2 }}>
      <Box sx={{ height: 300 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Autocomplete
            value={pipe.data.equipList[mainIndex].setId}
            options={setOptions()}
            getOptionLabel={(id) => SETS[gameId][id]?.name || ""}
            onChange={(_, newValue) => handleSet(newValue)}
            renderOption={(props, id) => {
              const { key, ...idProps } = props;
              const rarity = SETS[gameId][id]?.rarity;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{
                    "& > img": { mr: 2, flexShrink: 0 },
                    color: `rarityColor.${rarity}`,
                  }}
                  {...idProps}
                >
                  <Box
                    component="img"
                    loading="lazy"
                    alt={""}
                    src={SET_ASSETS[`./${gameId}/${id}.webp`]?.default}
                    sx={{ width: 25, height: 25, objectFit: "contain" }}
                  />
                  
                  {SETS[gameId][id]?.name || ""}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Set"
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Autocomplete
            value={pipe.data.equipList[mainIndex].stat}
            options={mainstatOptions}
            getOptionLabel={(id) => STATS[gameId][id]?.name || ""}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mainstat"
              />
            )}
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
                value={pipe.data.equipList[mainIndex].statMap[subIndex].stat}
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
                value={pipe.data.equipList[mainIndex].statMap[subIndex].value ?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                  const isLessThanMax = Number(newValue) <= (STATS[gameId][pipe.data.equipList[mainIndex].statMap[subIndex].stat]?.value * (gameId === "ww" ? 1 : 6));
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, "value");
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: STATS[gameId][pipe?.data.equipList[mainIndex].statMap[subIndex].stat]?.percent && (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
                disabled={!pipe.data.equipList[mainIndex].statMap[subIndex].stat}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      </Box>
    </Card>
  );
};

export default EquipCard;
