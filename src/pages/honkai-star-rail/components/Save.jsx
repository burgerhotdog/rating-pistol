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
import GAME_DATA from "../../../components/gameData";
import toPascalCase from "../../../components/toPascalCase";

const cImgs = import.meta.glob("../../../assets/char/hsr/*.webp", { eager: true });
const wImgs = import.meta.glob("../../../assets/weap/hsr/*.webp", { eager: true });

const Save = ({
  uid,
  isSaveOpen,
  setIsSaveOpen,
  myChars,
  setMyChars,
}) => {
  const [error, setError] = useState("");
  const [newCid, setNewCid] = useState("");
  const [newCdata, setNewCdata] = useState(() => blankCdata("HSR"));

  // When modal opens, reset newCid and newCdata
  useEffect(() => {
    if (isSaveOpen) {
      if (isSaveOpen === true) {
        setNewCid("");
        setNewCdata(blankCdata("HSR"));
      } else {
        setNewCid(isSaveOpen);
        setNewCdata(myChars[isSaveOpen]);
      }
    }
  }, [isSaveOpen, myChars]);
  
  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up("xl"));

  const charOptions = () => {
    return Object.keys(GAME_DATA["HSR"].CHARACTERS)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort();
  };

  const weapOptions = () => {
    return Object.keys(GAME_DATA["HSR"].WEAPONS)
      .filter(id => GAME_DATA["HSR"].WEAPONS[id].type === GAME_DATA["HSR"].CHARACTERS[newCid].type)
      .sort();
  };

  const set1Options = () => {
    return Object.keys(GAME_DATA["HSR"].SETS_RELIC)
      .sort();
  };

  const set2Options = () => {
    return Object.keys(GAME_DATA["HSR"].SETS_PLANAR)
      .sort();
  };

  // Validation before saving
  const validate = () => {
    const errors = [];
    // Types of errors
    if (!newCdata.weapon) errors.push("Select light cone");
    if (!newCdata.set1) errors.push("Select relic set");
    if (!newCdata.set2) errors.push("Select planar set");

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
    newCdata.score = getScore("HSR", newCid, newCdata);

    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, "HonkaiStarRail", newCid);
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

  const handleCancel = () => {
    setError("");
    setIsSaveOpen(false);
  };

  const handleCharacter = (newValue) => {
    setNewCid(newValue || "");
    setNewCdata(blankCdata("HSR"));
    setError("");
  };

  const handleWeapon = (newValue) => {
    setNewCdata((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

  const handleSet = (newValue, setNumber) => {
    setNewCdata((prev) => ({
      ...prev,
      [setNumber]: newValue || "",
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
              src={cImgs[`../../../assets/char/hsr/${toPascalCase(newCid)}.webp`]?.default}
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
                    label="Light Cone"
                  />
                )}
                fullWidth
                disableClearable={newCdata.weapon === ""}
              />
            </Grid>

            {/* Select relic set */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCdata.set1}
                options={set1Options()}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="4P Cavern Relics"
                  />
                )}
                fullWidth
                disableClearable={newCdata.set1 === ""}
              />
            </Grid>

            {/* Select planar set */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newCdata.set2}
                options={set2Options()}
                onChange={(_, newValue) => handleSet(newValue, "set2")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="2P Planar Ornaments"
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
                  src={wImgs[`../../../assets/weap/hsr/${toPascalCase(newCdata.weapon)}.webp`]?.default}
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
                      gameType={"HSR"}
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
