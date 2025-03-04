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
} from "@mui/material";
import ModalEditGearPiece from "./ModalEditGearPiece";

const ModalEditGear = ({
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
}) => {
  const { SETS } = gameData;
  const { setsIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const setOptions = (setType) => {
    return Object.keys(SETS)
      .filter(id => {
        return setType === "set" ?
          gameType === "HSR" ?
            id.substring(0, 1) === "1" :
            true :
          gameType === "HSR" ?
            id.substring(0, 1) === "3" :
            id !== action?.data?.info?.set[0];
      })
      .sort((a, b) => {
        const rarityA = SETS[a].rarity;
        const rarityB = SETS[b].rarity;
        return rarityA !== rarityB ?
          rarityB - rarityA :
          SETS[a].name.localeCompare(SETS[b].name);
      });
  };

  const handleSet = (newValue, setType) => {
    const clearSet2 = gameType === "ZZZ" && setType === "set";
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        info: {
          ...prev.data.info,
          ...(
            setType === "set" ?
              { set: [newValue || "", ""] } :
              { setExtra: newValue || "" }
          ),
          ...(clearSet2 && prev.set2 === newValue ? { setExtra: "" } : {}),
        },
      },
    }));
  };

  return (
    <Stack gap={2}>
      <Autocomplete
        size="small"
        value={action?.data?.info?.set[0] || ""}
        options={setOptions("set")}
        getOptionLabel={(id) => SETS[id]?.name || ""}
        onChange={(_, newValue) => handleSet(newValue, "set")}
        renderOption={(props, id) => {
          const { key, ...idProps } = props;
          const rarity = SETS[id]?.rarity;
          return (
            <Box
              key={key}
              component="li"
              sx={{
                "& > img": { mr: 2, flexShrink: 0 },
                color: rarityColor[rarity],
              }}
              {...idProps}
            >
              <Box
                component="img"
                loading="lazy"
                src={setsIcons[`../assets/sets/${gameType}/${id}.webp`]?.default}
                alt={""}
                sx={{ width: 24, height: 24, objectFit: "contain" }}
              />
              {SETS[id]?.name || ""}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Set"
            sx={{
              "& .MuiInputBase-root": {
                color: rarityColor[SETS[action?.data?.info?.set[0]]?.rarity] || "inherit",
              }
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: action?.data?.info?.set[0] && (
                  <InputAdornment position="start">
                    <Box
                      component="img"
                      src={setsIcons[`../assets/sets/${gameType}/${action?.data?.info?.set[0]}.webp`]?.default}
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
        disableClearable={action?.data?.info?.set[0] === ""}
      />

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        {[0, 1, 2, 3, 4, ...(gameType === "HSR" || gameType === "ZZZ" ? [5] : [])].map((mainIndex) => (
          <ModalEditGearPiece
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

export default ModalEditGear;
