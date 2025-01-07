import React from 'react';
import { Autocomplete, Box, Card, Divider, MenuItem, Select, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

const PIECE_NAMES = [
  "Head",
  "Hands",
  "Body",
  "Feet",
  "Sphere",
  "Rope",
]

const MAINSTAT_OPTIONS = [
  ["hp"],
  ["atk"],
  ["hp%", "atk%", "def%", "cr", "cd", "ohb", "ehr"],
  ["hp%", "atk%", "def%", "spd"],
  ["hp%", "atk%", "def%", "elemental dmg"],
  ["hp%", "atk%", "def%", "be", "err"],
];

const SUBSTAT_OPTIONS = [
  "hp",
  "atk",
  "def",
  "hp%",
  "atk%",
  "def%",
  "ehr",
  "cr",
  "cd",
  "be",
  "res",
  "spd",
];

const Piece = ({
  index,
  newCharObj,
  setNewCharObj,
}) => {
  // Pass mainstat change to newCharObj
  const handleMainstat = (_, value) => {
    setNewCharObj((prevChar) => {
      // Create copy of pieces array
      const updatedPieces = [...prevChar.pieces];
  
      // Update mainstat of piece at index
      updatedPieces[index] = {
        mainstat: value,
        substats: [
          { name: "", value: "" },
          { name: "", value: "" },
          { name: "", value: "" },
          { name: "", value: "" },
        ],
      };
  
      // Return updated state
      return {
        ...prevChar,
        pieces: updatedPieces,
      };
    });
  };

  // Pass substat change to newCharObj
  const handleSubstat = (e, subIndex, attribute) => {
    const value = e.target.value;
    setNewCharObj((prevChar) => {
      // Create copy of pieces array
      const updatedPieces = [...prevChar.pieces];

      // Create copy of substats array for piece at index
      const updatedSubstats = [...updatedPieces[index].substats];

      // Update substat attribute for substat at subIndex
      updatedSubstats[subIndex] = {
        ...updatedSubstats[subIndex],
        [attribute]: value,
      };

      // Update substats array for piece at index
      updatedPieces[index] = {
        ...updatedPieces[index],
        substats: updatedSubstats,
      };

      // Return updated state
      return {
        ...prevChar,
        pieces: updatedPieces,
      };
    });
  };

  const getFilteredSubstatOptions = (currentIndex) => {
    // Get the selected mainstat and substat names
    const selectedMainstat = newCharObj.pieces[index].mainstat;
    const selectedSubstatNames = newCharObj.pieces[index].substats
      .map((substat) => substat.name)
      .filter((_, idx) => idx !== currentIndex); // Exclude the current substat index
  
    return SUBSTAT_OPTIONS.filter(
      (option) =>
        option !== selectedMainstat && // Exclude mainstat
        !selectedSubstatNames.includes(option) // Exclude already selected substats
    );
  };

  return (
    <Card sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        {/* Mainstat */}
        <Grid size={12}>
          <Autocomplete
            size='small'
            value={newCharObj.pieces[index].mainstat || ""}
            options={MAINSTAT_OPTIONS[index]}
            onChange={handleMainstat}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[index]}
              />
            )}
            fullWidth
            disabled={index === 0 || index === 1}
          />
        </Grid>

        {/* Divider */}
        <Grid size={12}>
          <Divider />
        </Grid>

        {/* Substats */}
        {[0, 1, 2, 3].map((subIndex) => (
          <React.Fragment key={`${index}-${subIndex}`}>
            {/* Substat Name Dropdown */}
            <Grid size={6}>
              <Select
                value={newCharObj.pieces[index].substats[subIndex].name || ""}
                onChange={(e) => handleSubstat(e, subIndex, "name")}
                size="small"
                fullWidth
              >
                {getFilteredSubstatOptions(subIndex).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Substat Value Input */}
            <Grid size={6}>
              <TextField
                value={newCharObj.pieces[index].substats[subIndex].value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,1}$/.test(value)) {
                    handleSubstat(e, subIndex, "value")
                  }
                }}
                size="small"
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
