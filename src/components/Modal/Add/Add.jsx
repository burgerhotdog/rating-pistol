import React, { useState } from "react";
import { Box, Stack, Autocomplete, TextField, Button } from "@mui/material";
import template from "@config/template";
import { AVATAR_ASSETS } from "@assets";
import { AVATARS } from "@data";

const Add = ({ gameId, localDocs, pipe, setPipe, savePipe }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const charOptions = () => {
    return Object.keys(AVATARS[gameId])
      .filter(id => !Object.keys(localDocs).includes(id))
      .sort((a, b) => {
        const A = AVATARS[gameId][a];
        const B = AVATARS[gameId][b];
        return A.rarity !== B.rarity
          ? B.rarity - A.rarity
          : A.name.localeCompare(B.name);
      });
  };

  const handleSelect = (newValue) => {
    const id = newValue;
    const data = template(gameId);
    if (AVATARS[gameId][id].type === "Remembrance") {
      data.skillMap["005"] = 1;
      data.skillMap["006"] = 1;
    }

    setPipe((prev) => ({
      ...prev,
      id,
      data,
    }));
  };

  const handleAdd = async () => {
    setIsLoading(true);
    await savePipe();
    setPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Autocomplete
        value={pipe.id ?? ""}
        options={charOptions()}
        getOptionLabel={(id) => AVATARS[gameId][id]?.name ?? ""}
        onChange={(_, newValue) => handleSelect(newValue)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = AVATARS[gameId][option]?.rarity;
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
                src={AVATAR_ASSETS[`./${gameId}/${option}.webp`]?.default}
                alt=""
                sx={{ width: 24, height: 24, objectFit: "contain" }}
              />
              {AVATARS[gameId][option].name}
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
        disabled={!pipe.id}
      >
        Save
      </Button>
    </Stack>
  );
};

export default Add;
