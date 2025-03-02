import React from "react";
import { doc, setDoc } from "firebase/firestore";
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

const AddModal = ({
  uid,
  gameType,
  gameData,
  gameIcons,
  localCollection,
  setLocalCollection,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { CHAR } = gameData;
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
      .filter(id => !Object.keys(localCollection).includes(id))
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
    const gear = {
      0: templateGear(gameType),
      1: templateGear(gameType),
      2: templateGear(gameType),
      3: templateGear(gameType),
      4: templateGear(gameType),
      ...(gameType === "HSR" ? { 5: templateGear(gameType) } : {}),
      ...(gameType === "ZZZ" ? { 5: templateGear(gameType) } : {}),
    };

    if (uid) {
      const infoDocRef = doc(db, "users", uid, gameType, action?.id);
      const gearDocRef = doc(db, "users", uid, gameType, action?.id, "gear");
      await setDoc(infoDocRef, info, { merge: true });
      await setDoc(gearDocRef, gear, { merge: true });
    }

    setLocalCollection((prev) => ({
      ...prev,
      [action.id]: { info, gear },
    }));

    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.type === "add"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack gap={2}>
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
            sx={{ width: 256 }}
            disableClearable={action?.id === ""}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
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

export default AddModal;
