import React, { useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Modal,
  Box,
  Stack,
  Autocomplete,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { templateInfo, templateGear } from "../template";
import getData from "../getData";
import getIcons from "../getIcons";

const AddModal = ({
  userId,
  gameId,
  action,
  setAction,
  localObjs,
  setLocalObjs,
}) => {
  const theme = useTheme();
  const { generalData, avatarData } = getData(gameId);
  const { avatarIcons } = getIcons(gameId);
  const [isLoading, setIsLoading] = useState(false);
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  
  const charOptions = () => {
    return Object.keys(avatarData)
      .filter(id => !Object.keys(localObjs).includes(id))
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
      id: newValue || "",
    }));
  };

  const handleAdd = async () => {
    setIsLoading(true);
    const info = templateInfo(gameId);
    info.characterLevel = generalData.LEVEL_CAP.toString();
    info.characterRank = "0";
    for (const skill in info.skills) {
      info.skills[skill] = "1";
    }

    const gearList = Array(5).fill(null).map(() => templateGear(gameId));
    if (gameId === "HSR" || gameId === "ZZZ") {
      gearList.push(templateGear(gameId));
    }

    if (userId) {
      const batch = writeBatch(db);
      const infoDocRef = doc(db, "users", userId, gameId, action.id);
      batch.set(infoDocRef, info, { merge: true });
      for (const [index, gearObj] of gearList.entries()) {
        const gearDocRef = doc(db, "users", userId, gameId, action.id, "gearList", index.toString());
        batch.set(gearDocRef, gearObj, { merge: true });
      }
      await batch.commit();
    }

    setLocalObjs((prev) => ({
      ...prev,
      [action.id]: { info, gearList },
    }));

    setIsLoading(false);
    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "add"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack alignItems="center" spacing={2}>
          <Autocomplete
            size="small"
            value={action?.id}
            options={charOptions()}
            getOptionLabel={(id) => avatarData[id]?.name || ""}
            onChange={(_, newValue) => handleSelect(newValue)}
            renderOption={(props, id) => {
              const { key, ...idProps } = props;
              const rarity = avatarData[id]?.rarity;
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
                    src={avatarIcons[`./${id}.webp`]?.default}
                    alt={""}
                    sx={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {avatarData[id].name}
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
            disableClearable={action?.id === ""}
          />
          <Button
            onClick={handleAdd}
            loading={isLoading}
            variant="contained"
            color="primary"
            disabled={!action?.id}
          >
            Save
          </Button>
        </Stack>
      </Box>      
    </Modal>
  );
};

export default AddModal;
