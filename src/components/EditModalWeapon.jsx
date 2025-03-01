import React from "react";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

const EditModalWeapon = ({
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { CHAR, WEAP } = gameData;
  const { weapIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const weapOptions = () => {
    return Object.keys(WEAP)
      .filter(id => WEAP[id].type === CHAR[action.id]?.type)
      .sort((a, b) => {
        const rarityA = WEAP[a].rarity;
        const rarityB = WEAP[b].rarity;
        return rarityA !== rarityB ? 
          rarityB - rarityA : 
          WEAP[a].name.localeCompare(WEAP[b].name);
      });
  };

  const handleWeapon = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weapon: newValue || "",
      },
    }));
  };

  return (
    <Stack gap={2}>
      <Autocomplete
        size="small"
        value={action?.data?.weapon || ""}
        options={weapOptions()}
        getOptionLabel={(id) => WEAP[id]?.name || ""}
        onChange={(_, newValue) => handleWeapon(newValue)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = WEAP[option]?.rarity;
          return (
            <Box
              key={key}
              component="li"
              sx={{
                "& > img": { mr: 2, flexShrink: 0 },
                color: rarityColor[rarity],
              }}
              {...optionProps}
            >
              <img
                loading="lazy"
                src={weapIcons[`../assets/weap/${gameType}/${option}.webp`]?.default}
                alt={""}
                style={{ width: 24, height: 24, objectFit: "contain" }}
              />
              {WEAP[option]?.name || ""}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Weapon"
            sx={{
              "& .MuiInputBase-root": {
                color: rarityColor[WEAP[action?.data?.weapon]?.rarity] || "inherit",
              }
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: action?.data?.weapon && (
                  <InputAdornment position="start">
                    <img
                      src={weapIcons[`../assets/weap/${gameType}/${action?.data?.weapon}.webp`]?.default}
                      alt=""
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        fullWidth
        sx={{ width: 256 }}
        disableClearable={action?.data?.weapon === ""}
      />
    </Stack>
  );
};

export default EditModalWeapon;
