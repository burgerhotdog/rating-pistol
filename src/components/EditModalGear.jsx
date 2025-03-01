import React from "react";
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
import Piece from "./Piece";

const EditModalGear = ({
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { CHAR, WEAP, SETS } = gameData;
  const { setsIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const setOptions = (setNumber) => {
    return Object.keys(SETS)
      .filter(id => {
        return setNumber === "set1" ? 
          gameType === "HSR" ?
            id.substring(0, 1) === "1" :
            true :
          gameType === "HSR" ?
            id.substring(0, 1) === "3" :
            id !== action.data.set1;
      })
      .sort((a, b) => {
        const rarityA = SETS[a].rarity;
        const rarityB = SETS[b].rarity;
        return rarityA !== rarityB ?
          rarityB - rarityA :
          SETS[a].name.localeCompare(SETS[b].name);
      });
  };

  const handleSet = (newValue, setNumber) => {
    const clearSet2 = gameType === "ZZZ" && setNumber === "set1";
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [setNumber]: newValue || "",
        ...(clearSet2 && prev.set2 === newValue ? { set2: "" } : {}),
      },
    }));
  };

  return (
    <Stack gap={2}>
      <Autocomplete
        size="small"
        value={action?.data?.set1 || ""}
        options={setOptions("set1")}
        getOptionLabel={(id) => SETS[id]?.name || ""}
        onChange={(_, newValue) => handleSet(newValue, "set1")}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = SETS[option]?.rarity;
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
                src={setsIcons[`../assets/sets/${gameType}/${option}.webp`]?.default}
                alt={""}
                style={{ width: 24, height: 24, objectFit: "contain" }}
              />
              {SETS[option]?.name || ""}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Set 1"
            sx={{
              "& .MuiInputBase-root": {
                color: rarityColor[SETS[action?.data?.set1]?.rarity] || "inherit",
              }
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: action?.data?.set1 && (
                  <InputAdornment position="start">
                    <img
                      src={setsIcons[`../assets/sets/${gameType}/${action?.data?.set1}.webp`]?.default}
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
        disableClearable={action?.data?.set1 === ""}
      />

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        {[0, 1, 2, 3, 4, ...(gameType === "HSR" || gameType === "ZZZ" ? [5] : [])].map((mainIndex) => (
          <Piece
            key={mainIndex}
            gameType={gameType}
            gameData={gameData}
            action={action}
            setAction={setAction}
            mainIndex={mainIndex}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default EditModalGear;
