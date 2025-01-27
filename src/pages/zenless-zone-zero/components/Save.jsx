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
import blankCdata from "../blankCdata";
import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import SETS from "../data/SETS";

const cImgs = import.meta.glob("../assets/char/*.webp", { eager: true });
const wImgs = import.meta.glob("../assets/weap/*.webp", { eager: true });

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
      .filter(id => WEAPONS[id].type === CHARACTERS[newCharId].weapon)
      .sort();
  };

  // Gets filtered set ids for select set
  const getFilteredSetIds = (setNumber) => {
    if (setNumber === "set1")
      return Object.keys(SETS).sort();
    else
      return Object.keys(SETS)
        .filter(id => id !== newCharObj.set1)
        .sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapon) errors.push("Select W-Engine");
    if (!newCharObj.set1) errors.push("Select 4P drive set");
    if (!newCharObj.set2) errors.push("Select 2P drive set");

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
      const charDocRef = doc(db, "users", uid, "ZenlessZoneZero", newCharId);
      await setDoc(charDocRef, newCharObj, { merge: true });
    }

    // Save object to myChars
    setMyChars((prevChars) => ({
      ...prevChars,
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
      ...blankCdata(),
      name: CHARACTERS[newValue]?.name || "",
    });
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
  const handleSet = (newValue, setNumber) => {
    if (setNumber === "set1") {
      setNewCharObj((prev) => ({
        ...prev,
        set1: newValue || "",
        set2: prev.set2 === newValue ? "" : prev.set2,
      }));
    } else {
      setNewCharObj((prev) => ({
        ...prev,
        set2: newValue || "",
      }));
    }
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
              src={cImgs[`../assets/char/${newCharId}.webp`]?.default}
              alt={"char"}
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
            getOptionLabel={(id) => CHARACTERS[id]?.name || ""}
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
                getOptionLabel={(id) => WEAPONS[id]?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="W-Engine"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.weapon === ""}
              />
            </Grid>

            {/* Select 4P drive set */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCharObj.set1}
                options={getFilteredSetIds("set1")}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                getOptionLabel={(id) => SETS[id]?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="4P Drive Set"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.set1 === ""}
              />
            </Grid>

            {/* Select 2P drive set */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCharObj.set2}
                options={getFilteredSetIds("set2")}
                onChange={(_, newValue) => handleSet(newValue, "set2")}
                getOptionLabel={(id) => SETS[id]?.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="2P Drive Set"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.set2 === ""}
              />
            </Grid>

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {!isMobile && newCharObj.weapon && (
                <img
                  src={wImgs[`../assets/weap/${newCharObj.weapon}.webp`]?.default}
                  alt={"weap"}
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
                {[0, 1, 2, 3, 4, 5].map((mainIndex) => (
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
