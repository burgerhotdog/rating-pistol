import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
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
  
  // Theme and breakpoint
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
  const getFilteredSetIds = (setType) => {
    return Object.keys(setData)
      .filter(id => setData[id].type === setType)
      .sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCharObj.weapon.key) errors.push("Select light cone");
    if (!newCharObj.set1.key) errors.push("Select relic set");
    if (!newCharObj.set2.key) errors.push("Select planar set");

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
      const charDocRef = doc(db, "users", uid, "HonkaiStarRail", newCharId);
      await setDoc(charDocRef, newCharObj, { merge: true });
    }

    // Save object to myChars
    setMyChars((prevChars) => ({
      ...prevChars,
      [newCharId]: newCharObj,
    }));

    // Reset states
    setError("");
    setNewCharId("");
    setNewCharObj(initCharObj());
    setIsSaveOpen(false);
  };

  // Cancel button handler
  const handleCancel = () => {
    // Reset states
    setError("");
    setNewCharId("");
    setNewCharObj(initCharObj());
    setIsSaveOpen(false);
  };

  // Select character handler
  const handleCharacter = (newValue) => {
    setNewCharId(newValue || "");
    setNewCharObj({
      ...initCharObj(),
      name: charData[newValue]?.name || "",
    });
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
  const handleSet = (newValue, setNumber) => {
    setNewCharObj((prev) => ({
      ...prev,
      [setNumber]: {
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

        {/* Data grid */}
        {newCharId && (
          <Grid container
            spacing={2}
            sx={{
              width: { xs: 256, md: 1280 },
              mt: 2,
            }}
          >
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

            {/* Select relic set */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size="small"
                value={newCharObj.set1.key}
                options={getFilteredSetIds("Relic")}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                getOptionLabel={(id) => setData[id]?.name || ""}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="4P Cavern Relics"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.set1.key === ""}
              />
            </Grid>

            {/* Select planar set */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                size="small"
                value={newCharObj.set2.key}
                options={getFilteredSetIds("Planar")}
                onChange={(_, newValue) => handleSet(newValue, "set2")}
                getOptionLabel={(id) => setData[id]?.name || ""}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="2P Planar Ornaments"
                  />
                )}
                fullWidth
                disableClearable={newCharObj.set2.key === ""}
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
                <Typography textAlign={"center"}>No weapon selected</Typography>
              )}
            </Grid>

            {/* Piece grid */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Piece
                      index={index}
                      newCharObj={newCharObj}
                      setNewCharObj={setNewCharObj}
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
