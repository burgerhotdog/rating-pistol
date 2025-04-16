import { Autocomplete, TextField, Box, Paper } from "@mui/material";
import { SET_ASSETS } from "@assets";
import { SETS, LABELS } from "@data";

const SetId = ({ gameId, pipe, setPipe, mainIndex }) => {
  const setOptions = Object.keys(SETS[gameId])
    .filter((id) => {
      if (gameId !== "hsr") return true;
      return mainIndex < 4
        ? SETS[gameId][id].type === "Relic"
        : SETS[gameId][id].type === "Planar";
    })
    .sort((a, b) => {
      const A = SETS[gameId][a];
      const B = SETS[gameId][b];
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
      getOptionLabel={(id) => SETS[gameId][id]?.name ?? ""}
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
              alt=""
              src={SET_ASSETS[`./${gameId}/${id}.webp`]?.default}
              sx={{ width: 24, height: 24, objectFit: "contain" }}
            />
            {SETS[gameId][id]?.name ?? ""}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} label={`${LABELS[gameId].Equip} Set`} />
      )}
    />
  )
};

export default SetId;
