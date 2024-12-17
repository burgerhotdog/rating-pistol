import React from 'react';
import Grid from '@mui/material/Grid2';
import { Card, TextField, Typography } from '@mui/material';
import mainstats from '../data/mainstats';
import substats from '../data/substats';

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
    <Card sx={{ padding: 1 }}>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Typography variant="body1">{slotName}</Typography>
        </Grid>
        <Grid size={8}>
          <Typography variant="body1">{mainstats[newId][slotIndex]}</Typography>
        </Grid>

        {[0, 1, 2].map((subIndex) => (
          <React.Fragment key={subIndex}>
            <Grid size={8}>
              <Typography variant="body2">
                {substats[newId][subIndex]}
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
