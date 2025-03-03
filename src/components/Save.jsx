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
import dataTemplate from "./dataTemplate";

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
  const { CHAR, WEAP, SETS } = gameData;
  const [newId, setNewId] = useState("");
  const [newData, setNewData] = useState(() => dataTemplate(gameType));
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));

  // When modal opens, reset newId and newData
  useEffect(() => {
    if (isSaveOpen) {
      if (isSaveOpen === true) {
        setNewId("");
        setNewData(dataTemplate(gameType));
      } else {
        setNewId(isSaveOpen);
        setNewData(myChars[isSaveOpen]);
      }
    }
  }, [isSaveOpen, myChars]);
  
  const charOptions = () => {
    return Object.keys(CHAR)
      .filter(id => !Object.keys(myChars).includes(id))
      .sort((a, b) => {
        const rarityA = CHAR[a].rarity;
        const rarityB = CHAR[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return CHAR[a].name.localeCompare(CHAR[b].name);
      });
  };

  const weapOptions = () => {
    return Object.keys(WEAP)
      .filter(id => WEAP[id].type === CHAR[newId].type)
      .sort((a, b) => {
        const rarityA = WEAP[a].rarity;
        const rarityB = WEAP[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return WEAP[a].name.localeCompare(WEAP[b].name);
      });
  };

  const setOptions = (setNumber) => {
    return Object.keys(SETS)
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
              return id !== newData.set1;
            }
        }
      })
      .sort((a, b) => {
        const rarityA = SETS[a].rarity;
        const rarityB = SETS[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return SETS[a].name.localeCompare(SETS[b].name);
      });
  };

  const handleSave = async () => {
    // Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, newId);
      await setDoc(charDocRef, newData, { merge: true });
    }

    // Local
    setMyChars((prev) => ({
      ...prev,
      [newId]: newData,
    }));

    setNewId("");
    setNewData(() => dataTemplate(gameType));
    setIsSaveOpen(false);
  };

  const handleCancel = () => {
    setNewId("");
    setNewData(() => dataTemplate(gameType));
    setIsSaveOpen(false);
  };

  const handleCharacter = (newValue) => {
    setNewId(newValue || "");
    setNewData(dataTemplate(gameType));
  };

  const handleWeapon = (newValue) => {
    setNewData((prev) => ({
      ...prev,
      weapon: newValue || "",
    }));
  };

  const handleSet = (newValue, setNumber) => {
    const clearSet2 = gameType === "ZZZ" && setNumber === "set1";
    setNewData((prev) => ({
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
            value={newId}
            options={charOptions()}
            getOptionLabel={(id) => CHAR[id]?.name || ""}
            onChange={(_, newValue) => handleCharacter(newValue)}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              const rarity = CHAR[option]?.rarity;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{
                    "& > img": { mr: 2, flexShrink: 0 },
                    color: rarityColor[rarity],
                  }}
                  {...optionProps}
                >
                  <img
                    loading="lazy"
                    src={charIcons[`../assets/char/${gameType}/${option}.webp`]?.default}
                    alt={""}
                    style={{ width: 24, height: 24, objectFit: "contain" }}
                  />
                  {CHAR[option]?.name || ""}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Character"
                sx={{
                  "& .MuiInputBase-root": {
                    color: rarityColor[CHAR[newId]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: newId && (
                      <InputAdornment position="start">
                        <img
                          src={charIcons[`../assets/char/${gameType}/${newId}.webp`]?.default}
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
            disabled={isSaveOpen && (isSaveOpen !== true)}
            disableClearable={newId === ""}
          />

          {/* Save button */}
          {newId && (
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
        {newId && <Divider sx={{ mt: 2 }}/>}

        {/* Data grid */}
        {newId && (
          <Grid container spacing={2} sx={{ width: { xs: 256, xl: 1440 }, mt: 2 }}>
            {/* Select weapon */}
            <Grid size={{ xs: 12, xl: 4 }}>
              <Autocomplete
                size="small"
                value={newData.weapon}
                options={weapOptions()}
                getOptionLabel={(id) => WEAP[id]?.name || ""}
                onChange={(_, newValue) => handleWeapon(newValue)}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const rarity = WEAP[option]?.rarity;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{
                        "& > img": { mr: 2, flexShrink: 0 },
                        color: rarityColor[rarity],
                      }}
                      {...optionProps}
                    >
                      <img
                        loading="lazy"
                        src={weapIcons[`../assets/weap/${gameType}/${option}.webp`]?.default}
                        alt={""}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {WEAP[option]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weapon"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: rarityColor[WEAP[newData.weapon]?.rarity] || "inherit",
                      }
                    }}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: newData.weapon && (
                          <InputAdornment position="start">
                            <img
                              src={weapIcons[`../assets/weap/${gameType}/${newData.weapon}.webp`]?.default}
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
                disableClearable={newData.weapon === ""}
              />
            </Grid>

            {/* Select set */}
            <Grid size={{ xs: 12, xl: (gameType === "HSR" || gameType === "ZZZ" ? 4 : 8) }}>
              <Autocomplete
                size="small"
                value={newData.set1}
                options={setOptions("set1")}
                getOptionLabel={(id) => SETS[id]?.name || ""}
                onChange={(_, newValue) => handleSet(newValue, "set1")}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  const rarity = SETS[option]?.rarity;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{
                        "& > img": { mr: 2, flexShrink: 0 },
                        color: rarityColor[rarity],
                      }}
                      {...optionProps}
                    >
                      <img
                        loading="lazy"
                        src={setsIcons[`../assets/sets/${gameType}/${option}.webp`]?.default}
                        alt={""}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                      />
                      {SETS[option]?.name || ""}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Set 1"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: rarityColor[SETS[newData.set1]?.rarity] || "inherit",
                      }
                    }}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: newData.set1 && (
                          <InputAdornment position="start">
                            <img
                              src={setsIcons[`../assets/sets/${gameType}/${newData.set1}.webp`]?.default}
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
                disableClearable={newData.set1 === ""}
              />
            </Grid>

            {(gameType === "HSR" || gameType === "ZZZ") && (
              <Grid size={{ xs: 12, xl: 4 }}>
                <Autocomplete
                  size="small"
                  value={newData.set2}
                  options={setOptions("set2")}
                  getOptionLabel={(id) => SETS[id]?.name || ""}
                  onChange={(_, newValue) => handleSet(newValue, "set2")}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    const rarity = SETS[option]?.rarity;
                    return (
                      <Box
                        key={key}
                        component="li"
                        sx={{
                          "& > img": { mr: 2, flexShrink: 0 },
                          color: rarityColor[rarity],
                        }}
                        {...optionProps}
                      >
                        <img
                          loading="lazy"
                          src={setsIcons[`../assets/sets/${gameType}/${option}.webp`]?.default}
                          alt={""}
                          style={{ width: 24, height: 24, objectFit: "contain" }}
                        />
                        {SETS[option]?.name || ""}
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Set 2"
                      sx={{
                        "& .MuiInputBase-root": {
                          color: rarityColor[SETS[newData.set2]?.rarity] || "inherit",
                        }
                      }}
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          startAdornment: newData.set2 && (
                            <InputAdornment position="start">
                              <img
                                src={setsIcons[`../assets/sets/${gameType}/${newData.set2}.webp`]?.default}
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
                  disableClearable={newData.set2 === ""}
                />
              </Grid>
            )}

            {/* Weapon Image */}
            <Grid size={{ xs: 12, xl: 4 }}>
              {isDesktop && newData.weapon && (
                <img
                  src={weapIcons[`../assets/weap/${gameType}/${newData.weapon}.webp`]?.default}
                  alt={newData.weapon}
                  style={{ width: "100%", height: 500, objectFit: "contain" }}
                />
              )}
              {isDesktop && !newData.weapon && (
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
                      newData={newData}
                      setNewData={setNewData}
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
