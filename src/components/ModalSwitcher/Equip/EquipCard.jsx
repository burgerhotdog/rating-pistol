import React from "react";
import {
  Grid2 as Grid,
  Box,
  Card,
  Divider,
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material";
import getData from "../../getData";
import getImgs from "../../getImgs";

const EquipCard = ({
  gameId,
  modalPipe,
  setModalPipe,
  mainIndex,
}) => {
  const { MAINSTAT_OPTIONS, SUBSTAT_OPTIONS, STAT_INDEX, SET_DATA } = getData[gameId];
  const { SET_IMGS } = getImgs[gameId];

  const handleSet = (newValue) => {
    setModalPipe((prev) => ({
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
    setModalPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => 
          index === mainIndex
            ? {
              ...equipObj,
              key: newValue,
              statMap: {
                0: { key: null, value: null },
                1: { key: null, value: null },
                2: { key: null, value: null },
                3: { key: null, value: null },
                ...(gameId === "ww"
                  ? { 4: { key: null, value: null } }
                  : {}),
              },
            }
            : equipObj
        ),
      },
    }));
  };

  const handleSubstat = (newValue, subIndex, attribute) => {
    setModalPipe((prev) => ({
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
                  ...attribute === "key" ? { "value": null } : {},
                },
              },
            }
            : equipObj
        ),
      },
    }));
  };

  const substatOptions = (subIndex) => {
    const selectedMainstat = modalPipe.data.equipList[mainIndex].key;
    const selectedSubstats = Object.entries(modalPipe.data.equipList[mainIndex].statMap || {})
      .map(([, substatObj]) => substatObj.key)
      .filter((_, idx) => idx !== subIndex);
    
    return SUBSTAT_OPTIONS.filter((option) => gameId === "ww"
      ? !selectedSubstats.includes(option)
      : !selectedSubstats.includes(option) && option !== selectedMainstat);
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
    <Card sx={{ width: 400, p: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Autocomplete
            value={modalPipe.data.equipList[mainIndex].setId}
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
            value={modalPipe.data.equipList[mainIndex].key}
            options={MAINSTAT_OPTIONS[mainIndex]}
            getOptionLabel={(id) => STAT_INDEX[id]?.name || ""}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Mainstat"
              />
            )}
            disabled={!modalPipe.data.equipList[mainIndex].setId}
          />
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        {[0, 1, 2, 3, ...(gameId === "WW" ? [4] : [])].map((subIndex) => (
          <React.Fragment key={`${mainIndex}-${subIndex}`}>
            {/* Substat Key Dropdown */}
            <Grid size={9}>
              <Autocomplete
                value={modalPipe.data.equipList[mainIndex].statMap[subIndex].key}
                options={substatOptions(subIndex)}
                getOptionLabel={(id) => STAT_INDEX[id]?.name || ""}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "key")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Substat"}
                  />
                )}
                disabled={!modalPipe.data.equipList[mainIndex].key}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={3}>
              <TextField
                value={modalPipe.data.equipList[mainIndex].statMap[subIndex].value ?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                  const isLessThanMax = Number(newValue) <= (STAT_INDEX[modalPipe.data.equipList[mainIndex].statMap[subIndex].key]?.valueSub * (gameId === "ww" ? 1 : 6));
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, "value");
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: STAT_INDEX[modalPipe?.data.equipList[mainIndex].statMap[subIndex].key]?.percent && (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
                disabled={!modalPipe.data.equipList[mainIndex].statMap[subIndex].key}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
};

export default EquipCard;
