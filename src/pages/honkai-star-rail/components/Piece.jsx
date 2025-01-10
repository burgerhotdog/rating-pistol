import React from "react";
import { Autocomplete, Card, Divider, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const PIECE_NAMES = [
  "Head",
  "Hands",
  "Body",
  "Feet",
  "Orb",
  "Rope",
]

const MAINSTAT_OPTIONS = [
  { hp: "HP" },
  { atk: "ATK" },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    cr: "CRIT Rate",
    cd: "CRIT DMG",
    ohb: "Outgoing Healing",
    ehr: "Effect HIT Rate",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    spd: "Speed",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    physical: "Physical DMG",
    fire: "Fire DMG",
    ice: "Ice DMG",
    lightning: "Lightning DMG",
    wind: "Wind DMG",
    quantum: "Quantum DMG",
    imaginary: "Imaginary DMG",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    be: "Break Effect",
    err: "Energy Regen Rate"
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
  ehr: "Effect HIT Rate",
  res: "Effect RES",
  be: "Break Effect",
  spd: "Speed",
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
        substats: Array(4).fill({ name: "", value: "" }),
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
    const selectedSubstatNames = newCharObj.pieces[mainIndex].substats
      .map((substat) => substat.name)
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return Object.keys(SUBSTAT_OPTIONS).filter(
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
            disabled={mainIndex === 0 || mainIndex === 1}
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
                value={newCharObj.pieces[mainIndex].substats[subIndex].name || ""}
                options={getFilteredSubstatOptions(subIndex)}
                getOptionLabel={(id) => SUBSTAT_OPTIONS[id] || ""}
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
