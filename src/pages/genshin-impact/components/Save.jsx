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
import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import SETS from "../data/SETS";

const iconMedia = import.meta.glob("../assets/icon/*.webp", { eager: true });
const weaponMedia = import.meta.glob("../assets/weapon/*.webp", { eager: true });

function toPascalCase(str) {
  return str
    .replace(/'s\b/gi, "s")
    .match(/[a-z]+/gi)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

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
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Gets filtered character ids for select character
  const getFilteredCharIds = () => {
    return Object.keys(CHARACTERS)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort();
  };

  // Gets filtered weapon ids for select weapon
  const getFilteredWeapIds = () => {
    return Object.keys(WEAPONS)
      .filter(id => WEAPONS[id].type === CHARACTERS[newCharId].type)
      .sort();
  };

  // Gets filtered set ids for select set
  const getFilteredSetIds = () => {
    return Object.keys(SETS)
      .sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapon) errors.push("Select weapon");
    if (!newCharObj.set) errors.push("Select artifact set");

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
      const charDocRef = doc(db, "users", uid, "GenshinImpact", newCharId);
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
    setNewCharObj(initCharObj());
    setError("");
  };

  // Select weapon handler
  const handleWeapon = (newValue) => {
    setNewCharObj((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

  // Select set handler
  const handleSet = (newValue) => {
    setNewCharObj((prev) => ({
      ...prev,
      set: newValue || "",
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
              src={iconMedia[`../assets/icon/${toPascalCase(newCharId)}_Icon.webp`]?.default}
              alt={"Icon"}
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
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
              />
            )}
            sx={{ width: { xs: 128, xl: 256 } }}
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
          <Grid container spacing={2} sx={{ width: { xs: 256, xl: 1440 }, mt: 2 }}>
            {/* Select weapon */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCharObj.weapon}
                options={getFilteredWeapIds()}
                onChange={(_, newValue) => handleWeapon(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.weapon === ""}
              />
            </Grid>

            {/* Select set */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Autocomplete
                size="small"
                value={newCharObj.set}
                options={getFilteredSetIds()}
                onChange={(_, newValue) => handleSet(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Artifact Set"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.set === ""}
              />
            </Grid>

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {!isMobile && newCharObj.weapon && (
                <img
                  src={weaponMedia[`../assets/weapon/${toPascalCase(newCharObj.weapon)}.webp`]?.default}
                  alt={"Weapon"}
                  style={{
                    width: "100%",
                    height: 500,
                    objectFit: "contain",
                  }}
                />
              )}
              {!isMobile && !newCharObj.weapon && (
                <Typography textAlign="center">No weapon selected</Typography>
              )}
            </Grid>

            {/* Piece grid */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4].map((mainIndex) => (
                  <Grid size={{ xs: 12, xl: 4 }} key={mainIndex}>
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
