import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { db } from "../../../firebase";
import Piece from "./Piece";
import getScore from "../getScore";
import initCharObj from "../initCharObj";
import charData from "../data/charData";
import weapData from "../data/weapData";
import setData from "../data/setData";

const iconMedia = import.meta.glob("../assets/icon/*.webp", { eager: true });
const weaponMedia = import.meta.glob("../assets/weapon/*.webp", { eager: true });

const Save = ({
  uid,
  isSaveOpen,
  setIsSaveOpen,
  isEditMode,
  myChars,
  setMyChars,
  newCharId,
  setNewCharId,
  newCharObj,
  setNewCharObj,
}) => {
  const [error, setError] = useState("");
  
  // Mobile layout breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Gets filtered character ids for select character
  const getFilteredCharIds = () => {
    return Object.keys(charData)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort();
  };

  // Gets filtered weapon ids for select weapon
  const getFilteredWeapIds = () => {
    return Object.keys(weapData)
      .filter(id => weapData[id].type === charData[newCharId].weapon)
      .sort();
  };

  // Gets filtered set ids for select set
  const getFilteredSetIds = () => {
    return Object.keys(setData).sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapon.key) errors.push("Select weapon");
    if (!newCharObj.set.key) errors.push("Select echo set");

    // Display error message
    if (errors.length) {
      setError(errors.join(", "));
      return false;
    } else {
      setError("");
      return true;
    }
  };

  // Save button handler
  const handleSave = async () => {
    // Perform validation checks
    if (!validate()) return;

    // Calcuate and set score
    newCharObj.score = getScore(newCharId, newCharObj);

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, "WutheringWaves", newCharId);
      await setDoc(charDocRef, newCharObj, { merge: true });
    }

    // Save object to myChars
    setMyChars((prev) => ({
      ...prev,
      [newCharId]: newCharObj,
    }));

    setError("");
    setIsSaveOpen(false);
  };

  // Cancel button handler
  const handleCancel = () => {
    setError("");
    setIsSaveOpen(false);
  };

  // Select character handler
  const handleCharacter = (newValue) => {
    setNewCharId(newValue || "");
    setNewCharObj({
      ...initCharObj(),
      name: charData[newValue]?.name || "",
    });
    setError("");
  };

  // Select weapon handler
  const handleWeapon = (newValue) => {
    setNewCharObj((prev) => ({
      ...prev,
      weapon: {
        key: newValue || "",
        entry: weapData[newValue] || {},
      },
    }));
  };

  // Select set handler
  const handleSet = (newValue) => {
    setNewCharObj((prev) => ({
      ...prev,
      set: {
        key: newValue || "",
        entry: setData[newValue] || {},
      },
    }));
  };

  return (
    <Modal open={isSaveOpen} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#1c1c1c",
          padding: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Buttons section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Icon */}
          {newCharId && (
            <img
              src={iconMedia[`../assets/icon/${newCharId}_Icon.webp`]?.default}
              alt={newCharObj.name || "Icon"}
              style={{
                width: 50,
                height: 50,
                objectFit: "contain",
              }}
            />
          )}

          {/* Select Character */}
          <Autocomplete
            size="small"
            value={newCharId}
            options={getFilteredCharIds()}
            onChange={(_, newValue) => handleCharacter(newValue)}
            getOptionLabel={(id) => charData[id]?.name || ""}
            isOptionEqualToValue={(option, value) => option === value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
              />
            )}
            sx={{ width: 320 }}
            disabled={isEditMode}
            disableClearable={newCharId === ""}
          />

          {/* Save button */}
          {newCharId && (
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
          
          {/* Error section */}
          {error && (
            <Typography
              variant="body2"
              color="error"
            >
              {error}
            </Typography>
          )}
        </Box>

        {/* Divider */}
        {newCharId && <Divider sx={{ mt: 2 }}/>}

        {/* Data grid */}
        {newCharId && (
          <Grid container spacing={2} sx={{ width: { xs: 256, sm: 1280 }, mt: 2 }}>
            {/* Select weapon */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size="small"
                value={newCharObj.weapon.key}
                options={getFilteredWeapIds()}
                onChange={(_, newValue) => handleWeapon(newValue)}
                getOptionLabel={(id) => weapData[id]?.name || ""}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.weapon.key === ""}
              />
            </Grid>

            {/* Select echo set */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Autocomplete
                size="small"
                value={newCharObj.set.key}
                options={getFilteredSetIds()}
                onChange={(_, newValue) => handleSet(newValue)}
                getOptionLabel={(id) => setData[id]?.name || ""}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Echoes Set"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.set.key === ""}
              />
            </Grid>

            {/* Weapon Image */}
            <Grid size={{ xs: 12, md: 4 }}>
              {!isMobile && newCharObj.weapon.key && (
                <img
                  src={weaponMedia[`../assets/weapon/${newCharObj.weapon.key}.webp`]?.default}
                  alt={newCharObj.weapon.entry.name || "Weapon"}
                  style={{
                    width: "100%",
                    height: 500,
                    objectFit: "contain",
                  }}
                />
              )}
              {!isMobile && !newCharObj.weapon.key && (
                <Typography textAlign="center">No weapon selected</Typography>
              )}
            </Grid>

            {/* Piece grid */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4].map((mainIndex) => (
                  <Grid size={{ xs: 12, md: 4 }} key={mainIndex}>
                    <Piece
                      newCharObj={newCharObj}
                      setNewCharObj={setNewCharObj}
                      mainIndex={mainIndex}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Box>      
    </Modal>
  );
};

export default Save;
