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
import Piece from "../../../components/Piece";
import getScore from "../../../components/getScore";
import blankCdata from "../../../components/blankCdata";
import CHARACTERS from "../data/CHARACTERS";
import WEAPONS from "../data/WEAPONS";
import SETS from "../data/SETS";
import toPascalCase from "../../../components/toPascalCase";

const cImgs = import.meta.glob("../assets/char/*.webp", { eager: true });
const wImgs = import.meta.glob("../assets/weap/*.webp", { eager: true });

const Save = ({
  uid,
  isSaveOpen,
  setIsSaveOpen,
  myChars,
  setMyChars,
}) => {
  const [error, setError] = useState("");
  const [newCid, setNewCid] = useState("");
  const [newCdata, setNewCdata] = useState(() => blankCdata("ZZZ"));

  // When modal opens, reset newCid and newCdata
  useEffect(() => {
    if (isSaveOpen) {
      if (isSaveOpen === true) {
        setNewCid("");
        setNewCdata(blankCdata("ZZZ"));
      } else {
        setNewCid(isSaveOpen);
        setNewCdata(myChars[isSaveOpen]);
      }
    }
  }, [isSaveOpen, myChars]);
  
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("xl"));

  const charOptions = () => {
    return Object.keys(CHARACTERS)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort();
  };

  const weapOptions = () => {
    return Object.keys(WEAPONS)
      .filter(id => WEAPONS[id].type === CHARACTERS[newCid].type)
      .sort();
  };

  const setOptions = (setNumber) => {
    if (setNumber === "set1")
      return Object.keys(SETS).sort();
    else
      return Object.keys(SETS)
        .filter(id => id !== newCdata.set1)
        .sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCdata.weapon) errors.push("Select W-Engine");
    if (!newCdata.set1) errors.push("Select 4P drive set");
    if (!newCdata.set2) errors.push("Select 2P drive set");

    // Display error message
    if (errors.length) {
      setError(errors.join(", "));
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleSave = async () => {
    // Perform validation checks
    if (!validate()) return;

    // Calcuate and set score
    newCdata.score = getScore("ZZZ", newCid, newCdata);

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, "ZenlessZoneZero", newCid);
      await setDoc(charDocRef, newCdata, { merge: true });
    }

    // Save object to myChars
    setMyChars((prevChars) => ({
      ...prevChars,
      [newCid]: newCdata,
    }));

    setError("");
    setIsSaveOpen(false);
  };

  const handleCancel = () => {
    setError("");
    setIsSaveOpen(false);
  };

  const handleCharacter = (newValue) => {
    setNewCid(newValue || "");
    setNewCdata(blankCdata("ZZZ"));
    setError("");
  };

  const handleWeapon = (newValue) => {
    setNewCdata((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

  const handleSet = (newValue, setNumber) => {
    if (setNumber === "set1") {
      setNewCdata((prev) => ({
        ...prev,
        set1: newValue || "",
        set2: prev.set2 === newValue ? "" : prev.set2,
      }));
    } else {
      setNewCdata((prev) => ({
        ...prev,
        set2: newValue || "",
      }));
    }
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
              style={{ width: 50, height: 50, objectFit: "contain" }}
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
                    label="W-Engine"
                  />
                )}
                fullWidth
                disableClearable={newCdata.weapon === ""}
              />
            </Grid>

            {/* Select 4P drive set */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCdata.set1}
                options={setOptions("set1")}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="4P Drive Set"
                  />
                )}
                fullWidth
                disableClearable={newCdata.set1 === ""}
              />
            </Grid>

            {/* Select 2P drive set */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCdata.set2}
                options={setOptions("set2")}
                onChange={(_, newValue) => handleSet(newValue, "set2")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="2P Drive Set"
                  />
                )}
                fullWidth
                disableClearable={newCdata.set2 === ""}
              />
            </Grid>

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {isNotMobile && newCdata.weapon && (
                <img
                  src={wImgs[`../assets/weap/${toPascalCase(newCdata.weapon)}.webp`]?.default}
                  alt={"weap"}
                  style={{ width: "100%", height: 500, objectFit: "contain" }}
                />
              )}
              {isNotMobile && !newCdata.weapon && (
                <Typography textAlign="center">No weapon selected</Typography>
              )}
            </Grid>

            {/* Piece grid */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Grid container spacing={2}>
                {[0, 1, 2, 3, 4, 5].map((mainIndex) => (
                  <Grid size={{ xs: 12, xl: 4 }} key={mainIndex}>
                    <Piece
                      gameType={"ZZZ"}
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
