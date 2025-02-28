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
import dataTemplate from "./dataTemplate";

const AddModal = ({
  uid,
  gameType,
  gameData,
  gameIcons,
  myChars,
  setMyChars,
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
      .filter(id => !Object.keys(myChars).includes(id))
      .sort((a, b) => {
        const rarityA = CHAR[a].rarity;
        const rarityB = CHAR[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return CHAR[a].name.localeCompare(CHAR[b].name);
      });
  };

  const handleSelect = (newValue) => {
    setAction((prev) => ({
      ...prev,
      id: newValue || "",
    }));
  };

  const handleAdd = async () => {
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, action.id);
      await setDoc(charDocRef, dataTemplate(gameType), { merge: true });
    }

    setMyChars((prev) => ({
      ...prev,
      [action.id]: dataTemplate(gameType),
    }));

    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.e === "add"} onClose={handleCancel}>
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
                  <img
                    loading="lazy"
                    src={charIcons[`../assets/char/${gameType}/${option}.webp`]?.default}
                    alt={""}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {CHAR[option]?.name || ""}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
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
                        <img
                          src={charIcons[`../assets/char/${gameType}/${action.id}.webp`]?.default}
                          alt=""
                          style={{ width: 24, height: 24, objectFit: "contain" }}
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
            Add
          </Button>
        </Stack>
      </Box>      
    </Modal>
  );
};

export default AddModal;
