import React from "react";
import { Autocomplete, Card, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const PIECE_NAMES = [
  "4-Cost",
  "3-Cost",
  "3-Cost",
  "1-Cost",
  "1-Cost",
]

const MAINSTAT_OPTIONS = [
  ["hp%", "atk%", "def%", "cr", "cd", "hb"],
  ["hp%", "atk%", "def%", "elemental dmg", "er"],
  ["hp%", "atk%", "def%", "elemental dmg", "er"],
  ["hp%", "atk%", "def%"],
  ["hp%", "atk%", "def%"],
];

const SUBSTAT_OPTIONS = [
  "hp",
  "atk",
  "def",
  "hp%",
  "atk%",
  "def%",
  "cr",
  "cd",
  "er",
  "ba",
  "ha",
  "rs",
  "rl",
];

const Piece = ({
  newCharObj,
  setNewCharObj,
  mainIndex,
}) => {
  // Pass mainstat data to newCharObj
  const handleMainstat = (newValue) => {
    setNewCharObj((prev) => {
      // Create a copy of the pieces array
      const updatedPieces = [...prev.pieces];

      // Update the data in the copy
      updatedPieces[mainIndex] = {
        mainstat: newValue || "",
        substats: Array(5).fill({ name: "", value: "" }),
      };

      return {
        ...prev,
        pieces: updatedPieces,
      };
    });
  };

  // Pass substat data to newCharObj
  const handleSubstat = (newValue, subIndex, attribute) => {
    setNewCharObj((prev) => {
      // Create a copy of the substats array
      const updatedPieces = [...prev.pieces];
      const updatedSubstats = [...updatedPieces[mainIndex].substats];

      // Update the data in the copy
      updatedSubstats[subIndex] = {
        ...updatedSubstats[subIndex],
        [attribute]: newValue || "",
      };
      updatedPieces[mainIndex] = {
        ...updatedPieces[mainIndex],
        substats: updatedSubstats,
      };

      return {
        ...prev,
        pieces: updatedPieces,
      };
    });
  };

  const getFilteredSubstatOptions = (subIndex) => {
    // Get the selected mainstat and substat names
    const selectedSubstatNames = newCharObj.pieces[mainIndex].substats
      .map((substat) => substat.name)
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return SUBSTAT_OPTIONS.filter(
      (option) =>
        !selectedSubstatNames.includes(option) // Exclude already selected substats
    );
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {/* Mainstat */}
        <Grid size={12}>
          <Autocomplete
            size="small"
            value={newCharObj.pieces[mainIndex].mainstat || ""}
            options={MAINSTAT_OPTIONS[mainIndex]}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[mainIndex]}
              />
            )}
            fullWidth
            disableClearable={newCharObj.pieces[mainIndex].mainstat === ""}
          />
        </Grid>

        {/* Divider */}
        <Grid size={12}>
          <Divider />
        </Grid>

        {/* Substats */}
        {[0, 1, 2, 3, 4].map((subIndex) => (
          <React.Fragment key={`${mainIndex}-${subIndex}`}>
            {/* Substat Name Dropdown */}
            <Grid size={8}>
              <Autocomplete
                size="small"
                value={newCharObj.pieces[mainIndex].substats[subIndex].name || ""}
                options={getFilteredSubstatOptions(subIndex)}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "name")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"substat"}
                  />
                )}
                fullWidth
                disableClearable={newCharObj.pieces[mainIndex].substats[subIndex].name === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={4}>
              <TextField
                size="small"
                value={newCharObj.pieces[mainIndex].substats[subIndex].value || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (/^\d*\.?\d{0,1}$/.test(newValue)) {
                    handleSubstat(newValue, subIndex, "value")
                  }
                }}
                fullWidth
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
};

export default Piece;
