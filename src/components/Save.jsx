import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { db } from "../firebase";
import dataTemplate from "./dataTemplate";

const Save = ({
  uid,
  gameType,
  gameData,
  charIcons,
  weapIcons,
  setsIcons,
  isSaveOpen,
  setIsSaveOpen,
  myChars,
  setMyChars,
  addMode,
  setAddMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { CHAR } = gameData;
  const [newId, setNewId] = useState("");
  const [newData, setNewData] = useState(() => dataTemplate(gameType));
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  // When modal opens, reset newId and newData
  useEffect(() => {
    if (isSaveOpen) {
      if (isSaveOpen === true) {
        setNewId("");
        setNewData(dataTemplate(gameType));
      } else {
        setNewId(isSaveOpen);
        setNewData(myChars[isSaveOpen]);
      }
    }
  }, [isSaveOpen, myChars]);
  
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

  const handleSave = async () => {
    // Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, newId);
      await setDoc(charDocRef, newData, { merge: true });
    }

    // Local
    setMyChars((prev) => ({
      ...prev,
      [newId]: newData,
    }));

    setNewId("");
    setNewData(() => dataTemplate(gameType));
    setIsSaveOpen(false);
  };

  const handleCancel = () => {
    setNewId("");
    setNewData(() => dataTemplate(gameType));
    setIsSaveOpen(false);
  };

  const handleCharacter = (newValue) => {
    setNewId(newValue || "");
    setNewData(dataTemplate(gameType));
  };

  return (
    <Modal open={Boolean(isSaveOpen)} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Select Character */}
          <Autocomplete
            size="small"
            value={newId}
            options={charOptions()}
            getOptionLabel={(id) => CHAR[id]?.name || ""}
            onChange={(_, newValue) => handleCharacter(newValue)}
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
                    color: rarityColor[CHAR[newId]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: newId && (
                      <InputAdornment position="start">
                        <img
                          src={charIcons[`../assets/char/${gameType}/${newId}.webp`]?.default}
                          alt=""
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
            sx={{ width: { xs: 128, xl: 256 } }}
            disabled={isSaveOpen && (isSaveOpen !== true)}
            disableClearable={newId === ""}
          />

          {/* Save button */}
          {newId && (
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: 80 }}
            >
              Save
            </Button>
          )}

          {/* Cancel button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: 80 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>      
    </Modal>
  );
};

export default Save;
