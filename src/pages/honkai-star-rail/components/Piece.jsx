import React from "react";
import { Autocomplete, Card, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import MAINSTATS from "../data/MAINSTATS";
import SUBSTATS from "../data/SUBSTATS";

const PIECE_NAMES = ["Head", "Hands", "Body", "Feet", "Orb", "Rope"];

const Piece = ({
  newCdata,
  setNewCdata,
  mainIndex,
}) => {
  // Pass mainstat data to newCdata
  const handleMainstat = (newValue) => {
    setNewCdata((prev) => {
      // Create a copy of the pieces array
      const updatedPieces = [...prev.pieces];

      // Update the data in the copy
      updatedPieces[mainIndex] = {
        mainstat: newValue || "",
        substats: Array(4).fill({ key: "", value: "" }),
      };

      return {
        ...prev,
        pieces: updatedPieces,
      };
    });
  };

  // Pass substat data to newCdata
  const handleSubstat = (newValue, subIndex, attribute) => {
    setNewCdata((prev) => {
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

  const substatOptions = (subIndex) => {
    // Get the selected mainstat and substat names
    const selectedMainstat = newCdata.pieces[mainIndex].mainstat;
    const selectedSubstatKeys = newCdata.pieces[mainIndex].substats
      .map((substat) => substat.key)
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return Object.keys(SUBSTATS).filter(
      (option) =>
        option !== selectedMainstat && // Exclude mainstat
        !selectedSubstatKeys.includes(option) // Exclude already selected substats
    );
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {/* Mainstat */}
        <Grid size={12}>
          <Autocomplete
            size="small"
            value={newCdata.pieces[mainIndex].mainstat || ""}
            options={Object.keys(MAINSTATS[mainIndex])}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[mainIndex]}
              />
            )}
            fullWidth
            disabled={mainIndex === 0 || mainIndex === 1}
            disableClearable={newCdata.pieces[mainIndex].mainstat === ""}
          />
        </Grid>

        {/* Divider */}
        <Grid size={12}>
          <Divider />
        </Grid>

        {/* Substats */}
        {[0, 1, 2, 3].map((subIndex) => (
          <React.Fragment key={`${mainIndex}-${subIndex}`}>
            {/* Substat Name Dropdown */}
            <Grid size={9}>
              <Autocomplete
                size="small"
                value={newCdata.pieces[mainIndex].substats[subIndex].key || ""}
                options={substatOptions(subIndex)}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "key")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"substat"}
                  />
                )}
                fullWidth
                disableClearable={newCdata.pieces[mainIndex].substats[subIndex].key === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={3}>
              <TextField
                size="small"
                value={newCdata.pieces[mainIndex].substats[subIndex].value || ""}
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
