import React from 'react';
import Grid from '@mui/material/Grid2';
import { Box, Card, Divider, TextField, Typography } from '@mui/material';
import characterdb from '../data/characters';

const SlotCard = ({
  slotName,
  slotIndex,
  newId,
  newCharacter,
  setNewCharacter,
}) => {
  // Pass artifact inputs to newCharacter
  const handleSub = (e) => {
    const { name, value } = e.target;
    const [slotKey, subKey] = name.split('.');

    setNewCharacter((prevCharacter) => {
      const updatedSlot = {
        ...prevCharacter[slotKey],
        [subKey]: value,
      };

      return {
        ...prevCharacter,
        [slotKey]: updatedSlot,
      };
    });
  };

  return (
    <Card sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Box display='flex' justifyContent='space-between' alignItems="center">
            <Typography variant="body1">
              {slotName + ":"}
            </Typography>
            <Typography variant="body1" align="right">
              {characterdb[newId].mainstats[slotIndex]}
            </Typography>
          </Box>
        </Grid>

        <Grid size={12}>
          <Divider />
        </Grid>

        {[0, 1, 2].map((subIndex) => (
          <React.Fragment key={subIndex}>
            <Grid size={8}>
              <Typography variant="body2">
                {characterdb[newId].substats[subIndex]}
              </Typography>
            </Grid>
            <Grid size={4}>
              <TextField
                type="number"
                name={`${slotIndex}.${subIndex}`}
                value={newCharacter[slotIndex][subIndex]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d?$/.test(value)) { // Allow only numbers with up to 1 decimal place
                    handleSub(e);
                  }
                }}
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
