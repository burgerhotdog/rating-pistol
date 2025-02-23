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

const Save = ({
  uid,
  gameType,
  gameData,
  charIcons,
  weapIcons,
  setsIcons,
  isSaveOpen,
  setIsSaveOpen,
  myChars,
  setMyChars,
}) => {  
  const [newCid, setNewCid] = useState("");
  const [newCdata, setNewCdata] = useState(() => blankCdata(gameType));
  const textColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
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
  
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  const charOptions = () => {
    return Object.keys(gameData.CHAR)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort((a, b) => {
        const rarityA = gameData.CHAR[a].rarity;
        const rarityB = gameData.CHAR[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return gameData.CHAR[a].name.localeCompare(gameData.CHAR[b].name);
      });
  };

  const weapOptions = () => {
    return Object.keys(gameData.WEAP)
      .filter(id => gameData.WEAP[id].type === gameData.CHAR[newCid].type)
      .sort((a, b) => {
        const rarityA = gameData.WEAP[a].rarity;
        const rarityB = gameData.WEAP[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return gameData.WEAP[a].name.localeCompare(gameData.WEAP[b].name);
      });
  };

  const setOptions = (setNumber) => {
    return Object.keys(gameData.SETS)
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
      .sort((a, b) => {
        const rarityA = gameData.SETS[a].rarity;
        const rarityB = gameData.SETS[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return gameData.SETS[a].name.localeCompare(gameData.SETS[b].name);
      });
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
            getOptionLabel={(id) => gameData.CHAR[id]?.name || ""}
            onChange={(_, newValue) => handleCharacter(newValue)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const rarity = gameData.CHAR[option]?.rarity;
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
                    src={charIcons[`../assets/char/${gameType}/${option}.webp`]?.default}
                    alt={""}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {gameData.CHAR[option]?.name || ""}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
                sx={{
                  "& .MuiInputBase-root": {
                    color: textColor[gameData.CHAR[newCid]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: newCid && (
                      <InputAdornment position="start">
                        <img
                          src={charIcons[`../assets/char/${gameType}/${newCid}.webp`]?.default}
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
                getOptionLabel={(id) => gameData.WEAP[id]?.name || ""}
                onChange={(_, newValue) => handleWeapon(newValue)}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const rarity = gameData.WEAP[option]?.rarity;
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
                        src={weapIcons[`../assets/weap/${gameType}/${option}.webp`]?.default}
                        alt={""}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {gameData.WEAP[option]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: textColor[gameData.WEAP[newCdata.weapon]?.rarity] || "inherit",
                      }
                    }}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: newCdata.weapon && (
                          <InputAdornment position="start">
                            <img
                              src={weapIcons[`../assets/weap/${gameType}/${newCdata.weapon}.webp`]?.default}
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
                getOptionLabel={(id) => gameData.SETS[id]?.name || ""}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const rarity = gameData.SETS[option]?.rarity;
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
                        src={setsIcons[`../assets/sets/${gameType}/${option}.webp`]?.default}
                        alt={""}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {gameData.SETS[option]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Set 1"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: textColor[gameData.SETS[newCdata.set1]?.rarity] || "inherit",
                      }
                    }}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: newCdata.set1 && (
                          <InputAdornment position="start">
                            <img
                              src={setsIcons[`../assets/sets/${gameType}/${newCdata.set1}.webp`]?.default}
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
                  getOptionLabel={(id) => gameData.SETS[id]?.name || ""}
                  onChange={(_, newValue) => handleSet(newValue, "set2")}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    const rarity = gameData.SETS[option]?.rarity;
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
                          src={setsIcons[`../assets/sets/${gameType}/${option}.webp`]?.default}
                          alt={""}
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                        {gameData.SETS[option]?.name || ""}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Set 2"
                      sx={{
                        "& .MuiInputBase-root": {
                          color: textColor[gameData.SETS[newCdata.set2]?.rarity] || "inherit",
                        }
                      }}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: newCdata.set2 && (
                            <InputAdornment position="start">
                              <img
                                src={setsIcons[`../assets/sets/${gameType}/${newCdata.set2}.webp`]?.default}
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
              {isDesktop && newCdata.weapon && (
                <img
                  src={weapIcons[`../assets/weap/${gameType}/${newCdata.weapon}.webp`]?.default}
                  alt={newCdata.weapon}
                  style={{ width: "100%", height: 500, objectFit: "contain" }}
                />
              )}
              {isDesktop && !newCdata.weapon && (
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
                      gameData={gameData}
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
