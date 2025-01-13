import React from "react";
import { Autocomplete, Card, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const PIECE_NAMES = [
  "Disk 1",
  "Disk 2",
  "Disk 3",
  "Disk 4",
  "Disk 5",
  "Disk 6",
]

const MAINSTAT_OPTIONS = [
  { hp: "HP" },
  { atk: "ATK" },
  { def: "DEF" },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    cr: "CRIT Rate",
    cd: "CRIT DMG",
    ap: "Anomaly Proficiency",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    penp: "PEN Ratio",
    electric: "Electric DMG",
    ether: "Ether DMG",
    fire: "Fire DMG",
    ice: "Ice DMG",
    physical: "Physical DMG",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    am: "Anomaly Mastery",
    er: "Energy Regen",
    impact: "Impact",
  },
];

const SUBSTAT_OPTIONS = {
  hp: "HP",
  atk: "ATK",
  def: "DEF",
  hpp: "HP%",
  atkp: "ATK%",
  defp: "DEF%",
  cr: "CRIT Rate",
  cd: "CRIT DMG",
  pen: "PEN",
  ap: "Anomaly Proficiency",
};

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
        substats: Array(4).fill({ key: "", value: "" }),
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
    const selectedMainstat = newCharObj.pieces[mainIndex].mainstat;
    const selectedSubstatKeys = newCharObj.pieces[mainIndex].substats
      .map((substat) => substat.key)
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return Object.keys(SUBSTAT_OPTIONS).filter(
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
            value={newCharObj.pieces[mainIndex].mainstat || ""}
            options={Object.keys(MAINSTAT_OPTIONS[mainIndex])}
            getOptionLabel={(id) => MAINSTAT_OPTIONS[mainIndex][id] || ""}
            onChange={(_, newValue) => handleMainstat(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={PIECE_NAMES[mainIndex]}
              />
            )}
            fullWidth
            disabled={mainIndex === 0 || mainIndex === 1 || mainIndex === 2}
            disableClearable={newCharObj.pieces[mainIndex].mainstat === ""}
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
                value={newCharObj.pieces[mainIndex].substats[subIndex].key || ""}
                options={getFilteredSubstatOptions(subIndex)}
                getOptionLabel={(id) => SUBSTAT_OPTIONS[id] || ""}
                onChange={(_, newValue) => handleSubstat(newValue, subIndex, "key")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"substat"}
                  />
                )}
                fullWidth
                disableClearable={newCharObj.pieces[mainIndex].substats[subIndex].key === ""}
              />
            </Grid>

            {/* Substat Value Input */}
            <Grid size={3}>
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
