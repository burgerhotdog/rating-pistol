import React from 'react';
import { Autocomplete, Card, Divider, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';

const PIECE_NAMES = [
  "Head",
  "Hands",
  "Body",
  "Feet",
  "Orb",
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
  const handleMainstat = (value, reason) => {
    setNewCharObj((prevCharObj) => {
      // Create a copy of the pieces array
      const updatedPieces = [...prevCharObj.pieces];

      // Update the information in the copy
      updatedPieces[index] = {
        mainstat: reason === "clear" ? "" : value,
        substats: Array(4).fill({ name: "", value: "" }),
      };

      return {
        ...prevCharObj,
        pieces: updatedPieces,
      };
    });
  };

  // Pass substat change to newCharObj
  const handleSubstat = (value, reason, subIndex, attribute) => {
    setNewCharObj((prevCharObj) => {
      // Create a copy of the substats array
      const updatedPieces = [...prevCharObj.pieces];
      const updatedSubstats = [...updatedPieces[index].substats];

      // Update the information in the copy
      updatedSubstats[subIndex] = {
        ...updatedSubstats[subIndex],
        [attribute]: reason === "clear" ? "" : value,
      };
      updatedPieces[index] = {
        ...updatedPieces[index],
        substats: updatedSubstats,
      };

      return {
        ...prevCharObj,
        pieces: updatedPieces,
      };
    });
  };

  const getFilteredSubstatOptions = (subIndex) => {
    // Get the selected mainstat and substat names
    const selectedMainstat = newCharObj.pieces[index].mainstat;
    const selectedSubstatNames = newCharObj.pieces[index].substats
      .map((substat) => substat.name)
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return SUBSTAT_OPTIONS.filter(
      (option) =>
        option !== selectedMainstat && // Exclude mainstat
        !selectedSubstatNames.includes(option) // Exclude already selected substats
    );
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {/* Mainstat */}
        <Grid size={12}>
          <Autocomplete
            size='small'
            value={newCharObj.pieces[index].mainstat || ""}
            options={MAINSTAT_OPTIONS[index]}
            onChange={(_, value, reason) => {
              handleMainstat(value, reason);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[index]}
              />
            )}
            fullWidth
            disabled={index === 0 || index === 1}
            disableClearable={newCharObj.pieces[index].mainstat === ""}
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
            <Grid size={8}>
              <Autocomplete
                size='small'
                value={newCharObj.pieces[index].substats[subIndex].name || ""}
                options={getFilteredSubstatOptions(subIndex)}
                onChange={(_, value, reason) => {
                  handleSubstat(value, reason, subIndex, "name");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"substat"}
                  />
                )}
                fullWidth
                disableClearable={newCharObj.pieces[index].substats[subIndex].name === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={4}>
              <TextField
                size="small"
                value={newCharObj.pieces[index].substats[subIndex].value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,1}$/.test(value)) {
                    handleSubstat(value, null, subIndex, "value")
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
