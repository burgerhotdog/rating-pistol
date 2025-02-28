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

const EditWeap = ({
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
  const { weapIcons } = gameIcons;
  const rarityColor = {
    5: "goldenrod",
    4: "orchid",
    3: "cornflowerblue",
    2: "green",
    1: "slategrey",
  };

  const weapOptions = () => {
    return Object.keys(WEAP)
      .filter(id => WEAP[id].type === CHAR[action.id]?.type)
      .sort((a, b) => {
        const rarityA = WEAP[a].rarity;
        const rarityB = WEAP[b].rarity;
        if (rarityA !== rarityB) return rarityB - rarityA;
        return WEAP[a].name.localeCompare(WEAP[b].name);
      });
  };

  const handleWeapon = (newValue) => {
    setAction((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        weapon: newValue || "",
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

    setAction({});
  };

  const handleCancel = () => {
    setAction({});
  };

  return (
    <Modal open={action?.e === "weap"} onClose={handleCancel}>
      <Box sx={theme.customStyles.modal}>
        <Stack gap={2}>
          <Autocomplete
            size="small"
            value={action?.data?.weapon || ""}
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
                    color: rarityColor[WEAP[action?.data?.weapon]?.rarity] || "inherit",
                  }
                }}
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: action?.data?.weapon && (
                      <InputAdornment position="start">
                        <img
                          src={weapIcons[`../assets/weap/${gameType}/${action?.data?.weapon}.webp`]?.default}
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
            sx={{ width: 256 }}
            disableClearable={action?.data?.weapon === ""}
          />

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

export default EditWeap;
