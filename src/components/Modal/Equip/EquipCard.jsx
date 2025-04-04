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
import { ASSETS, DATA } from "../../importData";

const EquipCard = ({ gameId, pipe, setPipe, mainIndex }) => {
  const { STAT_INDEX, SET_DATA } = DATA[gameId];
  const { SET_IMGS } = ASSETS[gameId];

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

  const mainstatOptions = Object.keys(STAT_INDEX).filter(
    (stat) => STAT_INDEX[stat].index?.includes(mainIndex)
  );

  const substatOptions = (subIndex) => {
    const selectedMainstat = pipe.data.equipList[mainIndex].stat;
    const selectedSubstats = Object.entries(pipe.data.equipList[mainIndex].statMap || {})
      .map(([, substatObj]) => substatObj.stat)
      .filter((_, idx) => idx !== subIndex);
    
    return Object.keys(STAT_INDEX).filter((stat) => {
      const isSubstat = STAT_INDEX[stat].value;
      const isNotMainstat = gameId === "ww" || stat !== selectedMainstat;
      const isNotDuplicate = !selectedSubstats.includes(stat);
      return isSubstat && isNotDuplicate && isNotMainstat;
    });
  };

  const setOptions = () => {
    return Object.keys(SET_DATA)
      .filter(id => 
        gameId === "hsr"
          ? mainIndex <= 3
            ? SET_DATA[id].type === "Relic"
            : SET_DATA[id].type === "Planar" : true)
      .sort((a, b) => {
        const rarityA = SET_DATA[a].rarity;
        const rarityB = SET_DATA[b].rarity;
        return rarityA !== rarityB
          ? rarityB - rarityA
          : SET_DATA[a].name.localeCompare(SET_DATA[b].name);
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
            getOptionLabel={(id) => SET_DATA[id]?.name || ""}
            onChange={(_, newValue) => handleSet(newValue)}
            renderOption={(props, id) => {
              const { key, ...idProps } = props;
              const rarity = SET_DATA[id]?.rarity;
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
                    src={SET_IMGS[`./${id}.webp`]?.default}
                    sx={{ width: 25, height: 25, objectFit: "contain" }}
                  />
                  
                  {SET_DATA[id]?.name || ""}
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
            getOptionLabel={(id) => STAT_INDEX[id]?.name || ""}
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
                getOptionLabel={(id) => STAT_INDEX[id]?.name || ""}
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
                  const isLessThanMax = Number(newValue) <= (STAT_INDEX[pipe.data.equipList[mainIndex].statMap[subIndex].stat]?.value * (gameId === "ww" ? 1 : 6));
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, "value");
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: STAT_INDEX[pipe?.data.equipList[mainIndex].statMap[subIndex].stat]?.percent && (
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
