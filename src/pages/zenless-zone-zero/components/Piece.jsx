import React from "react";
import { Autocomplete, Card, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MAINSTATS, SUBSTATS } from "../data/STATS";

const PIECE_NAMES = ["Disk 1", "Disk 2", "Disk 3", "Disk 4", "Disk 5", "Disk 6"];

const Piece = ({
  newCdata,
  setNewCdata,
  mainIndex,
}) => {
  // Pass mainstat data to newCdata
  const handleMainstat = (newValue) => {
    setNewCdata((prev) => {
      // Create a copy of the mainstats array
      const updatedMainstats = [...prev.mainstats];

      // Update the data in the copy
      updatedMainstats[mainIndex] = newValue || "";

      return {
        ...prev,
        mainstats: updatedMainstats,
      };
    });
  };

  // Pass substat data to newCdata
  const handleSubstat = (newValue, subIndex, attribute) => {
    setNewCdata((prev) => {
      // Create a deep copy of the substats array
      const updatedSubstats = prev.substats.map((subArray) =>
        subArray.map((stat) => ({ ...stat }))
      );
  
      // Update the specific substat object
      updatedSubstats[mainIndex][subIndex] = {
        ...updatedSubstats[mainIndex][subIndex],
        [attribute]: newValue || "",
      };
  
      return {
        ...prev,
        substats: updatedSubstats,
      };
    });
  };

  const substatOptions = (subIndex) => {
    // Get the selected mainstat and substat names
    const selectedMainstat = newCdata.mainstats[mainIndex];
    const selectedSubstatKeys = newCdata.substats[mainIndex]
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
            value={newCdata.mainstats[mainIndex] || ""}
            options={Object.keys(MAINSTATS[mainIndex])}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[mainIndex]}
              />
            )}
            fullWidth
            disabled={mainIndex === 0 || mainIndex === 1 || mainIndex === 2}
            disableClearable={newCdata.mainstats[mainIndex] === ""}
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
                value={newCdata.substats[mainIndex][subIndex].key || ""}
                options={substatOptions(subIndex)}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "key")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"substat"}
                  />
                )}
                fullWidth
                disableClearable={newCdata.substats[mainIndex][subIndex].key === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={3}>
              <TextField
                size="small"
                value={newCdata.substats[mainIndex][subIndex].value || ""}
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
