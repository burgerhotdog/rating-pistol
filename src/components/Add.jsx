import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  Modal,
  TextField,
} from "@mui/material";
import { db } from "../firebase";
import dataTemplate from "./dataTemplate";

const Add = ({
  uid,
  gameType,
  gameData,
  charIcons,
  myChars,
  setMyChars,
  addMode,
  setAddMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addId, setAddId] = useState("");
  const { CHAR } = gameData;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  
  useEffect(() => {
    setAddId("");
    setIsModalOpen(!!addMode);
  }, [addMode]);
  
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
    setAddId(newValue || "");
  };

  const handleAdd = async () => {
    // Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, addId);
      await setDoc(charDocRef, dataTemplate(gameType), { merge: true });
    }

    // Local
    setMyChars((prev) => ({
      ...prev,
      [addId]: dataTemplate(gameType),
    }));

    setAddMode("");
  };

  const handleCancel = () => {
    setAddMode("");
  };

  return (
    <Modal open={isModalOpen} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "background.paper",
          padding: 4,
          borderRadius: 2,
          maxHeight: "80vh",
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
          <Autocomplete
            size="small"
            value={addId}
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
                    color: rarityColor[CHAR[addId]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: addId && (
                      <InputAdornment position="start">
                        <img
                          src={charIcons[`../assets/char/${gameType}/${addId}.webp`]?.default}
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
            disableClearable={addId === ""}
          />
          <Button 
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{ width: 80 }}
            disabled={!addId}
          >
            Add
          </Button>
        </Box>
      </Box>      
    </Modal>
  );
};

export default Add;
