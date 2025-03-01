import React from "react";
import {
  Autocomplete,
  Card,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const Piece = ({
  gameType,
  gameData,
  action,
  setAction,
  mainIndex,
}) => {
  const { PIECE_NAMES, MAINSTATS, SUBSTATS } = gameData.INFO;

  const handleMainstat = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        mainstats: prev.data.mainstats.map((stat, index) =>
          index === mainIndex ?
            newValue || "" :
            stat
        ),
        substats: {
          ...prev.data.substats,
          [mainIndex]: {
            0: ["", ""],
            1: ["", ""],
            2: ["", ""],
            3: ["", ""],
            ...(gameType === "WW" ? { 4: ["", ""] } : {}),
          },
        },
      },
    }));
  };

  const handleSubstat = (newValue, subIndex, attrIndex) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        substats: {
          ...prev.data.substats,
          [mainIndex]: {
            ...prev.data.substats[mainIndex],
            [subIndex]: {
              ...prev.data.substats[mainIndex]?.[subIndex],
              [attrIndex]: newValue || "",
              ...(attrIndex === 0 ? { 1: "" } : {}),
            },
          },
        },
      },
    }));
  };

  const substatOptions = (subIndex) => {
    const selectedMainstat = action.data.mainstats[mainIndex];
    const selectedSubstats = Object.values(action.data.substats[mainIndex])
      .map((substat) => substat[0])
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return Object.keys(SUBSTATS).filter(
      (option) => gameType === "WW" ?
        !selectedSubstats.includes(option) :
        !selectedSubstats.includes(option) && option !== selectedMainstat
    );
  };

  return (
    <Card sx={{ width: 250, p: 2 }}>
      <Grid container spacing={1}>
        {/* Mainstat */}
        <Grid size={12}>
          <Autocomplete
            size="small"
            value={action.data.mainstats[mainIndex] || ""}
            options={Object.keys(MAINSTATS[mainIndex])}
            getOptionLabel={(id) => MAINSTATS[mainIndex][id]?.name || ""}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[mainIndex]}
              />
            )}
            fullWidth
            disableClearable={action.data.mainstats[mainIndex] === ""}
          />
        </Grid>

        {/* Divider */}
        <Grid size={12}>
          <Divider />
        </Grid>

        {/* Substats */}
        {[0, 1, 2, 3, ...(gameType === "WW" ? [4] : [])].map((subIndex) => (
          <React.Fragment key={`${mainIndex}-${subIndex}`}>
            {/* Substat Key Dropdown */}
            <Grid size={8}>
              <Autocomplete
                size="small"
                value={action.data.substats[mainIndex][subIndex][0] || ""}
                options={substatOptions(subIndex)}
                getOptionLabel={(id) => SUBSTATS[id]?.name || ""}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, 0)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Substat"}
                  />
                )}
                fullWidth
                disabled={action.data.mainstats[mainIndex] === ""}
                disableClearable={action.data.substats[mainIndex][subIndex][0] === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={4}>
              <TextField
                size="small"
                value={action.data.substats[mainIndex][subIndex][1] || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                  const isLessThanMax = Number(newValue) <= (SUBSTATS[action.data.substats[mainIndex][subIndex][0]]?.value * (gameType === "WW" ? 1 : 6));
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, 1);
                  }
                }}
                fullWidth
                disabled={action.data.substats[mainIndex][subIndex][0] === ""}
                slotProps={{
                  input: {
                    endAdornment: SUBSTATS[action.data.substats[mainIndex][subIndex][0]]?.percent && (
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

export default Piece;
