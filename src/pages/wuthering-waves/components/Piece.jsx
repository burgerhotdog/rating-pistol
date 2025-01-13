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
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    cr: "CRIT Rate",
    cd: "CRIT DMG",
    hb: "Healing Bonus",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    aero: "Aero DMG",
    glacio: "Glacio DMG",
    fusion: "Fusion DMG",
    electro: "Electro DMG",
    havoc: "Havoc DMG",
    spectro: "Spectro DMG",
    er: "Energy Regen",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
    aero: "Aero DMG",
    glacio: "Glacio DMG",
    fusion: "Fusion DMG",
    electro: "Electro DMG",
    havoc: "Havoc DMG",
    spectro: "Spectro DMG",
    er: "Energy Regen",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
  },
  {
    hpp: "HP%",
    atkp: "ATK%",
    defp: "DEF%",
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
  er: "Energy Regen",
  ba: "Basic Attack DMG",
  ha: "Heavy Attack DMG",
  rs: "Resonance Skill DMG",
  rl: "Resonance Liberation DMG",
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
        substats: Array(5).fill({ key: "", value: "" }),
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
    const selectedSubstatKeys = newCharObj.pieces[mainIndex].substats
      .map((substat) => substat.key)
      .filter((_, idx) => idx !== subIndex); // Exclude the current substat
  
    return Object.keys(SUBSTAT_OPTIONS).filter(
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
