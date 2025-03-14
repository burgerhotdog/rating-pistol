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
  const { generalData, avatarData } = getData[gameId];
  const { avatarIcons } = getIcons[gameId];
  const [isLoading, setIsLoading] = useState(false);
  const [addId, setAddId] = useState(null);
  
  const charOptions = () => {
    return Object.keys(avatarData)
      .filter(id => !Object.keys(localDocs).includes(id))
      .sort((a, b) => {
        const rarityA = avatarData[a].rarity;
        const rarityB = avatarData[b].rarity;
        return rarityA != rarityB ?
          rarityB - rarityA :
          avatarData[a].name.localeCompare(avatarData[b].name)
      });
  };

  const handleSelect = (newValue) => {
    const id = newValue;
    const data = template(gameId);
    data.level = generalData.LEVEL_CAP;
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
        getOptionLabel={(option) => avatarData[option]?.name || ""}
        onChange={(_, newValue) => handleSelect(newValue)}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          const rarity = avatarData[option]?.rarity;
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
              {avatarData[option].name}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select"
          />
        )}
        sx={{ width: 250 }}
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
