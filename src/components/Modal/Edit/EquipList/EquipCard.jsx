import React from "react";
import {
  Grid2 as Grid,
  Card,
  Divider,
  Autocomplete,
  TextField,
  InputAdornment,
} from "@mui/material";
import getData from "../../../getData";

const EquipCard = ({
  gameId,
  action,
  setAction,
  mainIndex,
}) => {
  const { EQUIP_NAMES, MAINSTAT_OPTIONS, SUBSTAT_OPTIONS, STAT_INDEX } = getData(gameId).equipData;

  const handleMainstat = (newValue) => {
    setAction((prev) => ({
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
    setAction((prev) => ({
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
    const selectedMainstat = action.data.equipList[mainIndex].key;
    const selectedSubstats = Object.entries(action.data.equipList[mainIndex].statMap || {})
      .map(([, substatObj]) => substatObj.key)
      .filter((_, idx) => idx !== subIndex);
    
    return SUBSTAT_OPTIONS.filter((option) => gameId === "ww"
      ? !selectedSubstats.includes(option)
      : !selectedSubstats.includes(option) && option !== selectedMainstat);
  };

  return (
    <Card sx={{ width: 250, p: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Autocomplete
            size="small"
            value={action?.data?.equipList[mainIndex].key}
            options={MAINSTAT_OPTIONS[mainIndex]}
            getOptionLabel={(id) => STAT_INDEX[id]?.name || ""}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={EQUIP_NAMES[mainIndex]}
              />
            )}
            fullWidth
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
                size="small"
                value={action?.data.equipList[mainIndex].statMap[subIndex].key}
                options={substatOptions(subIndex)}
                getOptionLabel={(id) => STAT_INDEX[id]?.name || ""}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "key")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Substat"}
                  />
                )}
                fullWidth
                disabled={action?.data?.equipList[mainIndex].key === null}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={4}>
              <TextField
                size="small"
                value={action?.data.equipList[mainIndex].statMap[subIndex].value ?? ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                  const isLessThanMax = Number(newValue) <= (STAT_INDEX[action.data.equipList[mainIndex].statMap[subIndex].key]?.valueSub * (gameId === "ww" ? 1 : 6));
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, "value");
                  }
                }}
                fullWidth
                disabled={action?.data.equipList[mainIndex].statMap[subIndex].key === null}
                slotProps={{
                  input: {
                    endAdornment: STAT_INDEX[action?.data.equipList[mainIndex].statMap[subIndex].key]?.percent && (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
};

export default EquipCard;
