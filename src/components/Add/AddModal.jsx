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

const AddModal = ({
  uid,
  gameType,
  gameData,
  gameIcons,
  action,
  setAction,
  localObjs,
  setLocalObjs,
}) => {
  const theme = useTheme();
  const { INFO, CHARACTERS } = gameData;
  const { charIcons } = gameIcons;
  const [isLoading, setIsLoading] = useState(false);
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  
  const charOptions = () => {
    return Object.keys(CHARACTERS)
      .filter(id => !Object.keys(localObjs).includes(id))
      .sort((a, b) => {
        const rarityA = CHARACTERS[a].rarity;
        const rarityB = CHARACTERS[b].rarity;
        return rarityA != rarityB ?
          rarityB - rarityA :
          CHARACTERS[a].name.localeCompare(CHARACTERS[b].name)
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
    const info = templateInfo(gameType);
    info.characterLevel = INFO.LEVEL_CAP.toString();
    info.characterRank = "0";
    for (const skill in info.skills) {
      info.skills[skill] = "1";
    }

    const gearList = Array(5).fill(null).map(() => templateGear(gameType));
    if (gameType === "HSR" || gameType === "ZZZ") {
      gearList.push(templateGear(gameType));
    }

    if (uid) {
      const batch = writeBatch(db);
      const infoDocRef = doc(db, "users", uid, gameType, action.id);
      batch.set(infoDocRef, info, { merge: true });
      for (const [index, gearObj] of gearList.entries()) {
        const gearDocRef = doc(db, "users", uid, gameType, action.id, "gearList", index.toString());
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
            getOptionLabel={(id) => CHARACTERS[id]?.name || ""}
            onChange={(_, newValue) => handleSelect(newValue)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const rarity = CHARACTERS[option]?.rarity;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{
                    "& > img": { mr: 2, flexShrink: 0 },
                    color: rarityColor[rarity],
                  }}
                  {...optionProps}
                >
                  <Box
                    component="img"
                    loading="lazy"
                    src={charIcons[`../assets/char/${gameType}/${option}.webp`]?.default}
                    alt={""}
                    sx={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {CHARACTERS[option].name}
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
