import React from 'react';
import Grid from '@mui/material/Grid2';
import { Card, MenuItem, Select, TextField, Typography } from '@mui/material';

const SlotCard = ({
  slotName,
  slotNumber,
  slotMainStats,
  slotSubStats,
  newCharacter,
  handleArtifact,
  isDisabled,
}) => {
  // Helper function to filter substat options
  const getFilteredSubStats = (subStatKey) => {
    const mainStat = newCharacter[`slot${slotNumber}`].mainStat;
    const selectedSubStats = [
      newCharacter[`slot${slotNumber}`].subStatName1,
      newCharacter[`slot${slotNumber}`].subStatName2,
      newCharacter[`slot${slotNumber}`].subStatName3,
      newCharacter[`slot${slotNumber}`].subStatName4,
    ];
  
    // Include the current value of this substat key to prevent it from being filtered out
    const currentSubStat = newCharacter[`slot${slotNumber}`][subStatKey];
  
    return slotSubStats.filter(
      (stat) =>
        (stat !== mainStat && !selectedSubStats.includes(stat)) ||
        stat === currentSubStat
    );
  };

  return (
    <Card sx={{ padding: 1 }}>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Typography variant="body1">{slotName}</Typography>
        </Grid>
        <Grid size={8}>
          <Select
            name={`slot${slotNumber}.mainStat`}
            value={newCharacter[`slot${slotNumber}`].mainStat}
            onChange={handleArtifact}
            size="small"
            disabled={isDisabled}
            displayEmpty
            fullWidth
            sx={{
              height: '32px',
            }}
          >
            <MenuItem value="" disabled>
              (main)
            </MenuItem>
            {slotMainStats.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        {[1, 2, 3, 4].map((subIndex) => (
          <React.Fragment key={subIndex}>
            <Grid size={8}>
              <Select
                name={`slot${slotNumber}.subStatName${subIndex}`}
                value={newCharacter[`slot${slotNumber}`][`subStatName${subIndex}`]}
                onChange={handleArtifact}
                size="small"
                fullWidth
                displayEmpty
                sx={{
                  height: '24px',
                }}
              >
                <MenuItem value="" disabled>
                  (sub)
                </MenuItem>
                {getFilteredSubStats(`subStatName${subIndex}`).map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={4}>
              <TextField
                type="number"
                name={`slot${slotNumber}.subStatValue${subIndex}`}
                value={newCharacter[`slot${slotNumber}`][`subStatValue${subIndex}`]}
                onChange={handleArtifact}
                size="small"
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    height: '24px',
                    padding: '0 14px',
                  },
                  '& input': {
                    height: '100%',
                    padding: '0',
                  },
                }}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Card>
  );
};

export default SlotCard;
