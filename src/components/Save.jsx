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
import { db } from "../firebase";
import Piece from "./Piece";
import getScore from "./getScore";
import blankCdata from "./blankCdata";
import GAME_DATA from "./gameData";

const Save = ({
  gameType,
  uid,
  isSaveOpen,
  setIsSaveOpen,
  myChars,
  setMyChars,
}) => {
  let cImgs, wImgs;
  switch (gameType) {
    case "GI":
      cImgs = import.meta.glob(`../assets/char/GI/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/GI/*.webp`, { eager: true });
      break;
    case "HSR":
      cImgs = import.meta.glob(`../assets/char/HSR/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/HSR/*.webp`, { eager: true });
      break;
    case "ZZZ":
      cImgs = import.meta.glob(`../assets/char/ZZZ/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/ZZZ/*.webp`, { eager: true });
      break;
    case "WW":
      cImgs = import.meta.glob(`../assets/char/WW/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/WW/*.webp`, { eager: true });
      break;
  }
  
  const [newCid, setNewCid] = useState("");
  const [newCdata, setNewCdata] = useState(() => blankCdata(gameType));

  // When modal opens, reset newCid and newCdata
  useEffect(() => {
    if (isSaveOpen) {
      if (isSaveOpen === true) {
        setNewCid("");
        setNewCdata(blankCdata(gameType));
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
    return Object.keys(GAME_DATA[gameType].CHARACTERS)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort((a, b) => 
        GAME_DATA[gameType].CHARACTERS[a].name.localeCompare(GAME_DATA[gameType].CHARACTERS[b].name)
      );
  };

  const weapOptions = () => {
    return Object.keys(GAME_DATA[gameType].WEAPONS)
      .filter(id => GAME_DATA[gameType].WEAPONS[id].type === GAME_DATA[gameType].CHARACTERS[newCid].type)
      .sort((a, b) => 
        GAME_DATA[gameType].WEAPONS[a].name.localeCompare(GAME_DATA[gameType].WEAPONS[b].name)
      );
  };

  const setOptions = (setNumber) => {
    if (gameType !== "ZZZ" || setNumber === "set1") {
      return Object.keys(GAME_DATA[gameType].SETS)
        .sort((a, b) => 
          GAME_DATA[gameType].SETS[a].name.localeCompare(GAME_DATA[gameType].SETS[b].name)
        );
    } else if (setNumber === "set2") {
      return Object.keys(GAME_DATA[gameType].SETS)
        .filter(id => id !== newCdata.set1)
        .sort((a, b) => 
          GAME_DATA[gameType].SETS[a].name.localeCompare(GAME_DATA[gameType].SETS[b].name)
        );
    }
  };

  const set1Options = () => {
    return Object.keys(GAME_DATA["HSR"].SETS_RELIC)
      .sort((a, b) => 
        GAME_DATA["HSR"].SETS_RELIC[a].name.localeCompare(GAME_DATA["HSR"].SETS_RELIC[b].name)
      );
  };

  const set2Options = () => {
    return Object.keys(GAME_DATA["HSR"].SETS_PLANAR)
    .sort((a, b) => 
      GAME_DATA["HSR"].SETS_PLANAR[a].name.localeCompare(GAME_DATA["HSR"].SETS_PLANAR[b].name)
    );
  };

  const handleSave = async () => {
    // Save document to Firestore
    if (newCdata.score) {
      delete newCdata.score;
    }
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, newCid);
      await setDoc(charDocRef, newCdata, { merge: true });
    }

    // Calcuate and set score
    newCdata.score = getScore(gameType, newCid, newCdata);

    // Save object to myChars
    setMyChars((prev) => ({
      ...prev,
      [newCid]: newCdata,
    }));

    setIsSaveOpen(false);
  };

  const handleCancel = () => {
    setIsSaveOpen(false);
  };

  const handleCharacter = (newValue) => {
    setNewCid(newValue || "");
    setNewCdata(blankCdata(gameType));
  };

  const handleWeapon = (newValue) => {
    setNewCdata((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

  const handleSet = (newValue, setNumber) => {
    if (gameType === "HSR") {
      setNewCdata((prev) => ({
        ...prev,
        [setNumber]: newValue || "", // Dynamically set based on the setNumber
      }));
    } else if (gameType === "ZZZ") {
      if (setNumber === "set1") {
        setNewCdata((prev) => ({
          ...prev,
          set1: newValue || "",
          set2: prev.set2 === newValue ? "" : prev.set2, // Clear set2 if it's the same as set1
        }));
      } else {
        setNewCdata((prev) => ({
          ...prev,
          set2: newValue || "", // Handle set2 separately
        }));
      }
    } else {
      // For GI and WW, behave the same way
      setNewCdata((prev) => ({
        ...prev,
        set: newValue || "", // Directly set "set" field
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
              src={cImgs[`../assets/char/${gameType}/${newCid}.webp`]?.default}
              alt={"char"}
              style={{ width: 50, height: 50, objectFit: "contain" }}
            />
          )}

          {/* Select Character */}
          <Autocomplete
            size="small"
            value={newCid}
            options={charOptions()}
            getOptionLabel={(id) => GAME_DATA[gameType].CHARACTERS[id]?.name || ""}
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
                getOptionLabel={(id) => GAME_DATA[gameType].WEAPONS[id]?.name || ""}
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

            {/* Select set */}
            <Grid size={{ xs: 12, xl: ((gameType === "HSR" || gameType === "ZZZ") ? 4 : 8) }}>
              <Autocomplete
                size="small"
                value={(gameType === "HSR" || gameType === "ZZZ") ? newCdata.set1 : newCdata.set}
                options={gameType === "HSR" ? set1Options() : setOptions(gameType === "ZZZ" ? "set1" : "")}
                onChange={(_, newValue) => handleSet(newValue, (gameType === "ZZZ" || gameType === "HSR" ) ? "set1" : "")}
                getOptionLabel={(id) => (gameType === "HSR" ? GAME_DATA["HSR"].SETS_RELIC[id]?.name : GAME_DATA[gameType].SETS[id]?.name) || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Set 1"
                  />
                )}
                fullWidth
                disableClearable={((gameType === "HSR" || gameType === "ZZZ") ? newCdata.set1 : newCdata.set) === ""}
              />
            </Grid>

            {(gameType === "HSR" || gameType === "ZZZ") && (
              <Grid size={{ xs: 12, xl: 4 }}>
                <Autocomplete
                  size="small"
                  value={newCdata.set2}
                  options={gameType === "HSR" ? set2Options() : setOptions("set2")}
                  getOptionLabel={(id) => (gameType === "HSR" ? GAME_DATA["HSR"].SETS_PLANAR[id]?.name : GAME_DATA["ZZZ"].SETS[id]?.name) || ""}
                  onChange={(_, newValue) => handleSet(newValue, "set2")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Set 2"
                    />
                  )}
                  fullWidth
                  disableClearable={newCdata.set2 === ""}
                />
              </Grid>
            )}

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {isNotMobile && newCdata.weapon && (
                <img
                  src={wImgs[`../assets/weap/${gameType}/${newCdata.weapon}.webp`]?.default}
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
                {[0, 1, 2, 3, 4, ...(gameType === "HSR" || gameType === "ZZZ" ? [5] : [])].map((mainIndex) => (
                  <Grid size={{ xs: 12, xl: 4 }} key={mainIndex}>
                    <Piece
                      gameType={gameType}
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
