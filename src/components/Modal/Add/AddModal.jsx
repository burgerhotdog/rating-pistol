import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
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
  userId,
  action,
  setAction,
  localDocs,
  setLocalDocs,
}) => {
  const { generalData, avatarData } = getData[gameId];
  const { avatarIcons } = getIcons[gameId];
  const [isLoading, setIsLoading] = useState(false);
  
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
    setAction((prev) => ({
      ...prev,
      id: newValue,
    }));
  };

  const handleAdd = async () => {
    setIsLoading(true);
    const data = template(gameId);
    data.level = generalData.LEVEL_CAP;
    data.rank = 0;
    for (const skill in data.skillMap) {
      data.skillMap[skill] = 1;
    }

    if (userId) {
      const docRef = doc(db, "users", userId, gameId, action.id);
      await setDoc(docRef, data, { merge: true });
    }

    setLocalDocs((prev) => ({
      ...prev,
      [action.id]: data,
    }));

    setIsLoading(false);
    setAction({});
  };

  return (
    <Stack alignItems="center" spacing={2}>
      <Autocomplete
        size="small"
        value={action.id}
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
        disableClearable
      />
      <Button
        onClick={handleAdd}
        loading={isLoading}
        variant="contained"
        color="primary"
        disabled={!action.id}
      >
        Save
      </Button>
    </Stack>
  );
};

export default AddModal;
