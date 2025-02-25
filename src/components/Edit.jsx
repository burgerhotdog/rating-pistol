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
import Piece from "./Piece2";
import dataTemplate from "./dataTemplate";

const Edit = ({
  uid,
  gameType,
  gameData,
  charIcons,
  weapIcons,
  setsIcons,
  myChars,
  setMyChars,
  editEntry,
  setEditEntry,
}) => {
  const { CHAR, WEAP, SETS } = gameData;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  useEffect(() => {
    if (editEntry.id) {
      console.log(editEntry);
      setIsEditOpen(true);
    } else {
      setIsEditOpen(false);
    }
  }, [editEntry]);

  const weapOptions = () => {
    return Object.keys(WEAP)
      .filter(id => WEAP[id].type === CHAR[editEntry.id]?.type)
      .sort((a, b) => {
        const rarityA = WEAP[a].rarity;
        const rarityB = WEAP[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return WEAP[a].name.localeCompare(WEAP[b].name);
      });
  };

  const setOptions = (setNumber) => {
    return Object.keys(SETS)
      .filter(id => {
        switch (setNumber) {
          case "set1":
            if (gameType === "HSR") {
              return id.substring(0, 1) === "1";
            } else {
              return true;
            }
          case "set2":
            if (gameType === "HSR") {
              return id.substring(0, 1) === "3";
            } else {
              return id !== editEntry.data.set1;
            }
        }
      })
      .sort((a, b) => {
        const rarityA = SETS[a].rarity;
        const rarityB = SETS[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return SETS[a].name.localeCompare(SETS[b].name);
      });
  };

  const handleSave = async () => {
    // Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, editEntry.id);
      await setDoc(charDocRef, editEntry.data, { merge: true });
    }

    // Local
    setMyChars((prev) => ({
      ...prev,
      [editEntry.id]: editEntry.data,
    }));

    setEditEntry({ id: "", data: dataTemplate(gameType) });
  };

  const handleCancel = () => {
    setEditEntry({ id: "", data: dataTemplate(gameType) });
  };

  const handleWeapon = (newValue) => {
    setEditEntry((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weapon: newValue || "",
      },
    }));
  };

  const handleSet = (newValue, setNumber) => {
    const clearSet2 = gameType === "ZZZ" && setNumber === "set1";
    setEditEntry((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [setNumber]: newValue || "",
        ...(clearSet2 && prev.set2 === newValue ? { set2: "" } : {}),
      },
    }));
  };

  return (
    <Modal open={isEditOpen} onClose={handleCancel}>
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
        <Grid container spacing={2} sx={{ width: { xs: 256, xl: 1440 } }}>
          <Grid size={{ xs: 12, xl: 4 }}>
            {/* Char, Weap, Sets */}
            <Typography>Editing {CHAR[editEntry.id]?.name}</Typography>
            {/* Save button */}
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: 80 }}
            >
              Save
            </Button>
  
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ width: 80 }}
            >
              Cancel
            </Button>

            {/* Weap */}
            <Autocomplete
              size="small"
              value={editEntry?.data?.weapon || ""}
              options={weapOptions()}
              getOptionLabel={(id) => WEAP[id]?.name || ""}
              onChange={(_, newValue) => handleWeapon(newValue)}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const rarity = WEAP[option]?.rarity;
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
                      src={weapIcons[`../assets/weap/${gameType}/${option}.webp`]?.default}
                      alt={""}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                    {WEAP[option]?.name || ""}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Weapon"
                  sx={{
                    "& .MuiInputBase-root": {
                      color: rarityColor[WEAP[editEntry?.data?.weapon]?.rarity] || "inherit",
                    }
                  }}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: editEntry?.data?.weapon && (
                        <InputAdornment position="start">
                          <img
                            src={weapIcons[`../assets/weap/${gameType}/${editEntry?.data?.weapon}.webp`]?.default}
                            alt=""
                            style={{ width: 24, height: 24, objectFit: "contain" }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
              fullWidth
              disableClearable={editEntry?.data?.weapon === ""}
            />

            {/* Select set */}
            <Autocomplete
              size="small"
              value={editEntry?.data?.set1 || ""}
              options={setOptions("set1")}
              getOptionLabel={(id) => SETS[id]?.name || ""}
              onChange={(_, newValue) => handleSet(newValue, "set1")}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                const rarity = SETS[option]?.rarity;
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
                      src={setsIcons[`../assets/sets/${gameType}/${option}.webp`]?.default}
                      alt={""}
                      style={{ width: 24, height: 24, objectFit: "contain" }}
                    />
                    {SETS[option]?.name || ""}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Set 1"
                  sx={{
                    "& .MuiInputBase-root": {
                      color: rarityColor[SETS[editEntry?.data?.set1]?.rarity] || "inherit",
                    }
                  }}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: editEntry?.data?.set1 && (
                        <InputAdornment position="start">
                          <img
                            src={setsIcons[`../assets/sets/${gameType}/${editEntry?.data?.set1}.webp`]?.default}
                            alt=""
                            style={{ width: 24, height: 24, objectFit: "contain" }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
              fullWidth
              disableClearable={editEntry?.data?.set1 === ""}
            />
          </Grid>
          <Grid size={{ xs: 12, xl: 8 }}>
            {/* Pieces */}
            <Grid container spacing={2}>
              {[0, 1, 2, 3, 4, ...(gameType === "HSR" || gameType === "ZZZ" ? [5] : [])].map((mainIndex) => (
                <Grid size={{ xs: 12, xl: 4 }} key={mainIndex}>
                  <Piece
                    gameType={gameType}
                    gameData={gameData}
                    editEntry={editEntry}
                    setEditEntry={setEditEntry}
                    mainIndex={mainIndex}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default Edit;
