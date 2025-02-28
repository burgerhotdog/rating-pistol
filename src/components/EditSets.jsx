import React from "react";
import { doc, setDoc } from "firebase/firestore";
import Grid from "@mui/material/Grid2";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { db } from "../firebase";
import Piece from "./Piece";

const EditSets = ({
  uid,
  gameType,
  gameData,
  gameIcons,
  myChars,
  setMyChars,
  action,
  setAction,
}) => {
  const theme = useTheme();
  const { CHAR, WEAP, SETS } = gameData;
  const { setsIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
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
              return id !== action.data.set1;
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

  const handleSet = (newValue, setNumber) => {
    const clearSet2 = gameType === "ZZZ" && setNumber === "set1";
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [setNumber]: newValue || "",
        ...(clearSet2 && prev.set2 === newValue ? { set2: "" } : {}),
      },
    }));
  };

  const handleSave = async () => {
    // Firestore
    if (uid) {
      const charDocRef = doc(db, "users", uid, gameType, action.id);
      await setDoc(charDocRef, action.data, { merge: true });
    }

    // Local
    setMyChars((prev) => ({
      ...prev,
      [action.id]: action.data,
    }));

    console.log(action);

    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.e === "sets"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack gap={2}>
          {/* Select set */}
          <Autocomplete
            size="small"
            value={action?.data?.set1 || ""}
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
                    color: rarityColor[SETS[action?.data?.set1]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: action?.data?.set1 && (
                      <InputAdornment position="start">
                        <img
                          src={setsIcons[`../assets/sets/${gameType}/${action?.data?.set1}.webp`]?.default}
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
            disableClearable={action?.data?.set1 === ""}
          />

          {/* Pieces */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={2}
          >
            {[0, 1, 2, 3, 4, ...(gameType === "HSR" || gameType === "ZZZ" ? [5] : [])].map((mainIndex) => (
              <Piece
                key={mainIndex}
                gameType={gameType}
                gameData={gameData}
                action={action}
                setAction={setAction}
                mainIndex={mainIndex}
              />
            ))}
          </Box>

          <Stack flexDirection="row" justifyContent="center" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              sx={{ width: 80 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ width: 80 }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditSets;
