import { Autocomplete, TextField, Box, Paper } from "@mui/material";
import { SET_ASSETS } from "@assets";
import { SET_DATA, LABEL_DATA } from "@data";

const SetId = ({ gameId, pipe, setPipe, mainIndex }) => {
  const setOptions = Object.keys(SET_DATA[gameId])
    .filter((id) => {
      if (gameId !== "hsr") return true;
      return mainIndex < 4
        ? SET_DATA[gameId][id].type === "Relic"
        : SET_DATA[gameId][id].type === "Planar";
    })
    .sort((a, b) => {
      const A = SET_DATA[gameId][a];
      const B = SET_DATA[gameId][b];
      return A.rarity !== B.rarity
        ? B.rarity - A.rarity
        : A.name.localeCompare(B.name);
    });

  const handleSet = (newValue) => {
    setPipe((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        equipList: prev.data.equipList.map((equipObj, index) => {
          if (index !== mainIndex) return equipObj;
          return {
            ...equipObj,
            setId: String(newValue),
          };
        }),
      },
    }));
  };

  return (
    <Autocomplete
      value={pipe.data.equipList[mainIndex].setId ?? ""}
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
        const rarity = SET_DATA[gameId][id]?.rarity;
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
              alt=""
              src={SET_ASSETS[`./${gameId}/${id}.webp`]?.default}
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
