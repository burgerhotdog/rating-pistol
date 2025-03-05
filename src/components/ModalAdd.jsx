import React from "react";
import { writeBatch, doc } from "firebase/firestore";
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { db } from "../firebase";
import { templateInfo, templateGear } from "./template";

const ModalAdd = ({
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
  const { INFO, CHAR } = gameData;
  const { charIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  
  const charOptions = () => {
    return Object.keys(CHAR)
      .filter(id => !Object.keys(localObjs).includes(id))
      .sort((a, b) => {
        const rarityA = CHAR[a].rarity;
        const rarityB = CHAR[b].rarity;
        return rarityA != rarityB ?
          rarityB - rarityA :
          CHAR[a].name.localeCompare(CHAR[b].name)
      });
  };

  const handleSelect = (newValue) => {
    setAction((prev) => ({
      ...prev,
      id: newValue || "",
    }));
  };

  const handleAdd = async () => {
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

    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "add"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack spacing={2}>
          <Autocomplete
            size="small"
            value={action?.id}
            options={charOptions()}
            getOptionLabel={(id) => CHAR[id]?.name || ""}
            onChange={(_, newValue) => handleSelect(newValue)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const rarity = CHAR[option]?.rarity;
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
                  {CHAR[option]?.name || ""}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select"
                sx={{
                  "& .MuiInputBase-root": {
                    color: rarityColor[CHAR[action?.id]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: action?.id && (
                      <InputAdornment position="start">
                        <Box
                          component="img"
                          src={charIcons[`../assets/char/${gameType}/${action?.id}.webp`]?.default}
                          alt=""
                          sx={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
            sx={{ width: 250 }}
            disableClearable={action?.id === ""}
          />

          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            sx={{ width: 80 }}
            disabled={!action?.id}
          >
            Save
          </Button>
        </Stack>
      </Box>      
    </Modal>
  );
};

export default ModalAdd;
