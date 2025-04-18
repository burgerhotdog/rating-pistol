import React, { useState } from "react";
import { Box, Stack, Autocomplete, TextField, Button } from "@mui/material";
import template from "@config/template";
import { AVATAR_ASSETS } from "@assets";
import { AVATAR_DATA } from "@data";

const Add = ({ gameId, avatarCache, modalPipe, setModalPipe, pushModalPipe }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const charOptions = () => {
    return Object.keys(AVATAR_DATA[gameId])
      .filter(id => !Object.keys(avatarCache).includes(id))
      .sort((a, b) => {
        const A = AVATAR_DATA[gameId][a];
        const B = AVATAR_DATA[gameId][b];
        return A.rarity !== B.rarity
          ? B.rarity - A.rarity
          : A.name.localeCompare(B.name);
      });
  };

  const handleSelect = (newValue) => {
    const id = newValue;
    const data = template(gameId);
    if (AVATAR_DATA[gameId][id].type === "Remembrance") {
      data.skillMap["005"] = 1;
      data.skillMap["006"] = 1;
    }

    setModalPipe((prev) => ({
      ...prev,
      id,
      data,
    }));
  };

  const handleAdd = async () => {
    setIsLoading(true);
    await pushModalPipe(true);
    setModalPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Autocomplete
        value={modalPipe.id ?? ""}
        options={charOptions()}
        getOptionLabel={(id) => AVATAR_DATA[gameId][id]?.name ?? ""}
        onChange={(_, newValue) => handleSelect(newValue)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = AVATAR_DATA[gameId][option]?.rarity;
          return (
            <Box
              key={key}
              component="li"
              sx={{
                "& > img": { mr: 2, flexShrink: 0 },
                color: `rarityColor.${rarity}`,
              }}
              {...optionProps}
            >
              <Box
                component="img"
                loading="lazy"
                src={AVATAR_ASSETS[gameId][option]}
                alt=""
                sx={{ width: 24, height: 24, objectFit: "contain" }}
              />
              {AVATAR_DATA[gameId][option].name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField {...params} label="Select" />
        )}
        sx={{ width: 300 }}
      />
      
      <Button
        onClick={handleAdd}
        variant="contained"
        color="primary"
        loading={isLoading}
        disabled={!modalPipe.id}
      >
        Save
      </Button>
    </Stack>
  );
};

export default Add;
