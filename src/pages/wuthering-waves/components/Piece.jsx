import React from "react";
import { Autocomplete, Card, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { MAINSTATS, SUBSTATS } from "../data/STATS";

const PIECE_NAMES = ["4-Cost", "3-Cost", "3-Cost", "1-Cost", "1-Cost"];

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
      const updatedSubstats = [...prev.substats];

      // Update the data in the copy
      updatedMainstats[mainIndex] = newValue || "";

      // Clear the substats for the updated mainstat
      updatedSubstats[mainIndex] = {
        0: ["",""],
        1: ["",""],
        2: ["",""],
        3: ["",""],
        4: ["",""],
      };

      return {
        ...prev,
        mainstats: updatedMainstats,
        substats: updatedSubstats,
      };
    });
  };

  // Pass substat data to newCdata
  const handleSubstat = (newValue, subIndex, attrIndex) => {
    setNewCdata((prev) => {
      // Create a deep copy of the substats array
      const updatedSubstats = JSON.parse(JSON.stringify(prev.substats));
  
      // Update the specific substat object
      updatedSubstats[mainIndex][subIndex][attrIndex] = newValue || "";

      // If updating the key (index 0), reset the value (index 1) to an empty string
      if (attrIndex === 0) {
        updatedSubstats[mainIndex][subIndex][1] = "";
      }
      
      return {
        ...prev,
        substats: updatedSubstats,
      };
    });
  };

  const substatOptions = (subIndex) => {
    // Get the selected mainstat and substat names
    const selectedSubstatKeys = Object.values(newCdata.substats[mainIndex])
      .map((substat) => substat[0])
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return Object.keys(SUBSTATS).filter(
      (option) =>
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
            disableClearable={newCdata.mainstats[mainIndex] === ""}
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
            <Grid size={9}>
              <Autocomplete
                size="small"
                value={newCdata.substats[mainIndex][subIndex][0] || ""}
                options={substatOptions(subIndex)}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, 0)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Substat"}
                  />
                )}
                fullWidth
                disabled={newCdata.mainstats[mainIndex] === ""}
                disableClearable={newCdata.substats[mainIndex][subIndex][0] === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={3}>
              <TextField
                size="small"
                value={newCdata.substats[mainIndex][subIndex][1] || ""}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isValidNumber = /^\d*\.?\d{0,1}$/.test(newValue);
                  const isLessThanMax = Number(newValue) <= SUBSTATS[newCdata.substats[mainIndex][subIndex][0]];
                  if (isValidNumber && isLessThanMax) {
                    handleSubstat(newValue, subIndex, 1);
                  }
                }}
                fullWidth
                disabled={newCdata.substats[mainIndex][subIndex][0] === ""}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
};

export default Piece;
