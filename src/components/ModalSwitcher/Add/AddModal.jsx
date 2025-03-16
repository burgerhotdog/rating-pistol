import React, { useState } from "react";
import {
  Box,
  Stack,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import template from "../../template";
import getData from "../../getData";
import getIcons from "../../getIcons";

const AddModal = ({
  gameId,
  localDocs,
  modalPipe,
  setModalPipe,
  savePipe,
}) => {
  const { LEVEL_CAP, AVATAR_DATA } = getData[gameId];
  const { avatarIcons } = getIcons[gameId];
  const [isLoading, setIsLoading] = useState(false);
  
  const charOptions = () => {
    return Object.keys(AVATAR_DATA)
      .filter(id => !Object.keys(localDocs).includes(id))
      .sort((a, b) => {
        const rarityA = AVATAR_DATA[a].rarity;
        const rarityB = AVATAR_DATA[b].rarity;
        return rarityA != rarityB
          ? rarityB - rarityA
          : AVATAR_DATA[a].name.localeCompare(AVATAR_DATA[b].name);
      });
  };

  const handleSelect = (newValue) => {
    const id = newValue;
    const data = template(gameId);
    data.level = LEVEL_CAP;
    data.rank = 0;

    setModalPipe((prev) => ({
      ...prev,
      id,
      data,
    }));
  };

  const handleAdd = async () => {
    setIsLoading(true);
    await savePipe();
    
    setModalPipe({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Autocomplete
        value={modalPipe.id}
        options={charOptions()}
        getOptionLabel={(option) => AVATAR_DATA[option]?.name || ""}
        onChange={(_, newValue) => handleSelect(newValue)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = AVATAR_DATA[option]?.rarity;
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
                src={avatarIcons[`./${option}.webp`]?.default}
                alt={""}
                sx={{ width: 25, height: 25, objectFit: "contain" }}
              />
              {AVATAR_DATA[option].name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select"
          />
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

export default AddModal;
