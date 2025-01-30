import React, { useEffect, useState } from "react";
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

function toPascalCase(str) {
  return str
    .replace(/'s\b/gi, "s") // Step 1: Replace possessive "'s" with "s"
    .match(/[a-z0-9]+/gi) // Step 2: Match alphabetic and numeric substrings
    .map(word =>
      /^[0-9]/.test(word) // Check if the word starts with a number
        ? word // Leave it as is if it starts with a number
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // PascalCase for alphabetic substrings
    )
    .join('');
}

const Save = ({
  uid,
  isSaveOpen,
  setIsSaveOpen,
  myChars,
  setMyChars,
}) => {
  const [error, setError] = useState("");
  const [newCid, setNewCid] = useState("");
  const [newCdata, setNewCdata] = useState(blankCdata);

  // When modal opens, reset newCid and newCdata
  useEffect(() => {
    if (isSaveOpen) {
      if (isSaveOpen === true) {
        setNewCid("");
        setNewCdata(blankCdata());
      } else {
        setNewCid(isSaveOpen);
        setNewCdata(myChars[isSaveOpen]);
      }
    }
  }, [isSaveOpen, myChars]);
  
  // Mobile layout breakpoint
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Gets filtered character ids for select character
  const charOptions = () => {
    return Object.keys(CHARACTERS)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort();
  };

  // Gets filtered weapon ids for select weapon
  const weapOptions = () => {
    return Object.keys(WEAPONS)
      .filter(id => WEAPONS[id].type === CHARACTERS[newCid].type)
      .sort();
  };

  // Gets filtered set ids for select set
  const setOptions = () => {
    return Object.keys(SETS).sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCdata.weapon) errors.push("Select weapon");
    if (!newCdata.set) errors.push("Select echo set");

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
    newCdata.score = getScore(newCid, newCdata);

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, "WutheringWaves", newCid);
      await setDoc(charDocRef, newCdata, { merge: true });
    }

    // Save object to myChars
    setMyChars((prev) => ({
      ...prev,
      [newCid]: newCdata,
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
    setNewCid(newValue || "");
    setNewCdata(blankCdata());
    setError("");
  };

  // Select weapon handler
  const handleWeapon = (newValue) => {
    setNewCdata((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

  // Select set handler
  const handleSet = (newValue) => {
    setNewCdata((prev) => ({
      ...prev,
      set: newValue || "",
    }));
  };

  return (
    <Modal open={Boolean(isSaveOpen)} onClose={handleCancel}>
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
          {newCid && (
            <img
              src={cImgs[`../assets/char/${toPascalCase(newCid)}.webp`]?.default}
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
            value={newCid}
            options={charOptions()}
            onChange={(_, newValue) => handleCharacter(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
              />
            )}
            sx={{ width: { xs: 128, xl: 256 } }}
            disabled={isSaveOpen && isSaveOpen !== true}
            disableClearable={newCid === ""}
          />

          {/* Save button */}
          {newCid && (
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
        {newCid && <Divider sx={{ mt: 2 }}/>}

        {/* Data grid */}
        {newCid && (
          <Grid container spacing={2} sx={{ width: { xs: 256, xl: 1440 }, mt: 2 }}>
            {/* Select weapon */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCdata.weapon}
                options={weapOptions()}
                onChange={(_, newValue) => handleWeapon(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                  />
                )}
                fullWidth
                disableClearable={newCdata.weapon === ""}
              />
            </Grid>

            {/* Select echo set */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Autocomplete
                size="small"
                value={newCdata.set}
                options={setOptions()}
                onChange={(_, newValue) => handleSet(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Echoes Set"
                  />
                )}
                fullWidth
                disableClearable={newCdata.set === ""}
              />
            </Grid>

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {!isMobile && newCdata.weapon && (
                <img
                  src={wImgs[`../assets/weap/${toPascalCase(newCdata.weapon)}.webp`]?.default}
                  alt={"weap"}
                  style={{
                    width: "100%",
                    height: 500,
                    objectFit: "contain",
                  }}
                />
              )}
              {!isMobile && !newCdata.weapon && (
                <Typography textAlign="center">No weapon selected</Typography>
              )}
            </Grid>

            {/* Piece grid */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4].map((mainIndex) => (
                  <Grid size={{ xs: 12, xl: 4 }} key={mainIndex}>
                    <Piece
                      newCdata={newCdata}
                      setNewCdata={setNewCdata}
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
