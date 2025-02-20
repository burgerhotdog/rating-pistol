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
import Piece from "./Piece";
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
  let cImgs, wImgs, sImgs;
  switch (gameType) {
    case "GI":
      cImgs = import.meta.glob(`../assets/char/GI/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/GI/*.webp`, { eager: true });
      sImgs = import.meta.glob(`../assets/set/GI/*.webp`, { eager: true });
      break;
    case "HSR":
      cImgs = import.meta.glob(`../assets/char/HSR/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/HSR/*.webp`, { eager: true });
      sImgs = import.meta.glob(`../assets/set/HSR/*.webp`, { eager: true });
      break;
    case "ZZZ":
      cImgs = import.meta.glob(`../assets/char/ZZZ/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/ZZZ/*.webp`, { eager: true });
      sImgs = import.meta.glob(`../assets/set/ZZZ/*.webp`, { eager: true });
      break;
    case "WW":
      cImgs = import.meta.glob(`../assets/char/WW/*.webp`, { eager: true });
      wImgs = import.meta.glob(`../assets/weap/WW/*.webp`, { eager: true });
      sImgs = import.meta.glob(`../assets/set/WW/*.webp`, { eager: true });
      break;
  }
  
  const [newCid, setNewCid] = useState("");
  const [newCdata, setNewCdata] = useState(() => blankCdata(gameType));
  const textColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "darkseagreen",
    1: "slategrey",
  };

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
    return Object.keys(GAME_DATA[gameType].SETS)
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
              return id !== newCdata.set1;
            }
        }
      })
      .sort((a, b) => 
        GAME_DATA[gameType].SETS[a].name.localeCompare(GAME_DATA[gameType].SETS[b].name)
      );
  };

  const handleSave = async () => {
    // Save document to Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, newCid);
      await setDoc(charDocRef, newCdata, { merge: true });
    }

    // Save object to myChars
    setMyChars((prev) => ({
      ...prev,
      [newCid]: newCdata,
    }));

    setNewCid("");
    setNewCdata(() => blankCdata(gameType));
    setIsSaveOpen(false);
  };

  const handleCancel = () => {
    setNewCid("");
    setNewCdata(() => blankCdata(gameType));
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
    const clearSet2 = gameType === "ZZZ" && setNumber === "set1";
    setNewCdata((prev) => ({
      ...prev,
      [setNumber]: newValue || "",
      ...(clearSet2 && prev.set2 === newValue ? { set2: "" } : {}),
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
          {/* Select Character */}
          <Autocomplete
            size="small"
            value={newCid}
            options={charOptions()}
            getOptionLabel={(id) => GAME_DATA[gameType].CHARACTERS[id]?.name || ""}
            onChange={(_, newValue) => handleCharacter(newValue)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const rarity = GAME_DATA[gameType].CHARACTERS[option]?.rarity;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{
                    "& > img": { mr: 2, flexShrink: 0 },
                    color: textColor[rarity],
                  }}
                  {...optionProps}
                >
                  <img
                    loading="lazy"
                    src={cImgs[`../assets/char/${gameType}/${option}.webp`]?.default}
                    alt={""}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {GAME_DATA[gameType].CHARACTERS[option]?.name || ""}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
                sx={{
                  "& .MuiInputBase-root": {
                    color: textColor[GAME_DATA[gameType].CHARACTERS[newCid]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: newCid && (
                      <InputAdornment position="start">
                        <img
                          src={cImgs[`../assets/char/${gameType}/${newCid}.webp`]?.default}
                          alt=""
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
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
                getOptionLabel={(id) => GAME_DATA[gameType].WEAPONS[id]?.name || ""}
                onChange={(_, newValue) => handleWeapon(newValue)}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const rarity = GAME_DATA[gameType].WEAPONS[option]?.rarity;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{
                        "& > img": { mr: 2, flexShrink: 0 },
                        color: textColor[rarity],
                      }}
                      {...optionProps}
                    >
                      <img
                        loading="lazy"
                        src={wImgs[`../assets/weap/${gameType}/${option}.webp`]?.default}
                        alt={""}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {GAME_DATA[gameType].WEAPONS[option]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: textColor[GAME_DATA[gameType].WEAPONS[newCdata.weapon]?.rarity] || "inherit",
                      }
                    }}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: newCdata.weapon && (
                          <InputAdornment position="start">
                            <img
                              src={wImgs[`../assets/weap/${gameType}/${newCdata.weapon}.webp`]?.default}
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
                disableClearable={newCdata.weapon === ""}
              />
            </Grid>

            {/* Select set */}
            <Grid size={{ xs: 12, xl: (gameType === "HSR" || gameType === "ZZZ" ? 4 : 8) }}>
              <Autocomplete
                size="small"
                value={newCdata.set1}
                options={setOptions("set1")}
                getOptionLabel={(id) => GAME_DATA[gameType].SETS[id]?.name || ""}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const rarity = GAME_DATA[gameType].SETS[option]?.rarity;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{
                        "& > img": { mr: 2, flexShrink: 0 },
                        color: textColor[rarity],
                      }}
                      {...optionProps}
                    >
                      <img
                        loading="lazy"
                        src={sImgs[`../assets/set/${gameType}/${option}.webp`]?.default}
                        alt={""}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {GAME_DATA[gameType].SETS[option]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Set 1"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: textColor[GAME_DATA[gameType].SETS[newCdata.set1]?.rarity] || "inherit",
                      }
                    }}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: newCdata.set1 && (
                          <InputAdornment position="start">
                            <img
                              src={sImgs[`../assets/set/${gameType}/${newCdata.set1}.webp`]?.default}
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
                disableClearable={newCdata.set1 === ""}
              />
            </Grid>

            {(gameType === "HSR" || gameType === "ZZZ") && (
              <Grid size={{ xs: 12, xl: 4 }}>
                <Autocomplete
                  size="small"
                  value={newCdata.set2}
                  options={setOptions("set2")}
                  getOptionLabel={(id) => GAME_DATA[gameType].SETS[id]?.name || ""}
                  onChange={(_, newValue) => handleSet(newValue, "set2")}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    const rarity = GAME_DATA[gameType].SETS[option]?.rarity;
                    return (
                      <Box
                        key={key}
                        component="li"
                        sx={{
                          "& > img": { mr: 2, flexShrink: 0 },
                          color: textColor[rarity],
                        }}
                        {...optionProps}
                      >
                        <img
                          loading="lazy"
                          src={sImgs[`../assets/set/${gameType}/${option}.webp`]?.default}
                          alt={""}
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                        {GAME_DATA[gameType].SETS[option]?.name || ""}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Set 2"
                      sx={{
                        "& .MuiInputBase-root": {
                          color: textColor[GAME_DATA[gameType].SETS[newCdata.set2]?.rarity] || "inherit",
                        }
                      }}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: newCdata.set2 && (
                            <InputAdornment position="start">
                              <img
                                src={sImgs[`../assets/char/${gameType}/${newCdata.set2}.webp`]?.default}
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
                  disableClearable={newCdata.set2 === ""}
                />
              </Grid>
            )}

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {isNotMobile && newCdata.weapon && (
                <img
                  src={wImgs[`../assets/weap/${gameType}/${newCdata.weapon}.webp`]?.default}
                  alt={newCdata.weapon}
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
