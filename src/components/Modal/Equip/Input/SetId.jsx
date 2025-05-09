import { useMemo } from "react";
import { Autocomplete, TextField, Box, Paper } from "@mui/material";
import { SET_ASSETS } from "@assets";
import { SET_DATA, LABEL_DATA } from "@data";

const SetId = ({ gameId, equipList, setEquipList, mainIndex }) => {
  const setOptions = useMemo(() =>
    Object.keys(SET_DATA[gameId])
      .filter((id) => {
        if (gameId !== "hsr") return true;
        return mainIndex < 4
          ? SET_DATA[gameId][id].type === "Relic"
          : SET_DATA[gameId][id].type === "Planar";
      })
      .sort((a, b) => {
        return SET_DATA[gameId][a].name.localeCompare(SET_DATA[gameId][b].name);
      }), [gameId, mainIndex]);

  const handleSet = (newValue) =>
    setEquipList(prev => {
      const newList = structuredClone(prev);
      newList[mainIndex].setId = newValue;
      return newList;
    });

  return (
    <Autocomplete
      value={equipList[mainIndex].setId}
      options={setOptions}
      getOptionLabel={(id) => SET_DATA[gameId][id]?.name ?? ""}
      onChange={(_, newValue) => handleSet(newValue)}
      slots={{
        paper: ({ children }) => (
          <Paper elevation={3}>
            {children}
          </Paper>
        ),
      }}
      renderOption={(props, id) => {
        const { key, ...idProps } = props;
        const srcFolder = SET_ASSETS[gameId][id];
        const src = gameId === "gi"
          ? srcFolder["0"]
          : gameId === "hsr"
            ? mainIndex < 4
              ? srcFolder["0"]
              : srcFolder["4"]
            : srcFolder;
        return (
          <Box
            key={key}
            component="li"
            sx={{
              "& > img": { mr: 2, flexShrink: 0 },
            }}
            {...idProps}
          >
            <Box
              component="img"
              loading="lazy"
              alt=""
              src={src}
              sx={{ width: 24, height: 24, objectFit: "contain" }}
            />
            {SET_DATA[gameId][id]?.name ?? ""}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={`${LABEL_DATA[gameId].Equip} Set`} />
      )}
    />
  )
};

export default SetId;
