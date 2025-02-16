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
import getScore from "../../../components/getScore";
import blankCdata from "./blankCdata";
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
  const [error, setError] = useState({});
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

  const setOptions = () => {
    return Object.keys(SETS).sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = { weapon: false, set: false };
    if (!newCdata.weapon) errors.weapon = true;
    if (!newCdata.set) errors.set = true;
  
    setError(errors);
    return !errors.weapon && !errors.set;
  };

  const handleSave = async () => {
    // Perform validation checks
    if (!validate()) return;

    // Calcuate and set score
    newCdata.score = getScore("GI", newCid, newCdata);

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, "GenshinImpact", newCid);
      await setDoc(charDocRef, newCdata, { merge: true });
    }

    // Save object to myChars
    setMyChars((prev) => ({
      ...prev,
      [newCid]: newCdata,
    }));

    setError({});
    setIsSaveOpen(false);
  };

  const handleCancel = () => {
    setError({});
    setIsSaveOpen(false);
  };

  const handleCharacter = (newValue) => {
    setNewCid(newValue || "");
    setNewCdata(blankCdata());
    setError({});
  };

  const handleWeapon = (newValue) => {
    setNewCdata((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

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
                    error={error.weapon}
                    helperText={error.weapon ? "No weapon selected" : ""}
                  />
                )}
                fullWidth
                disableClearable={newCdata.weapon === ""}
              />
            </Grid>

            {/* Select set */}
            <Grid size={{ xs: 12, xl: 8 }}>
              <Autocomplete
                size="small"
                value={newCdata.set}
                options={setOptions()}
                onChange={(_, newValue) => handleSet(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Artifact Set"
                    error={error.set}
                    helperText={error.set ? "No set selected" : ""}
                  />
                )}
                fullWidth
                disableClearable={newCdata.set === ""}
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
