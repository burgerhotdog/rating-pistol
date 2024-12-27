import React from 'react';
import { Box, Card, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import charData from '../data/charData';

const SlotCard = ({
  slotName,
  slotIndex,
  newCharId,
  newCharObj,
  setNewCharObj,
}) => {
  // Pass substat inputs to newCharObj
  const handleSub = (e) => {
    const { name, value } = e.target;
    const [slotKey, subKey] = name.split('.');

    setNewCharObj((prevChar) => {
      // Update substat
      const updatedSlot = {
        ...prevChar[slotKey],
        [subKey]: value,
      };

      // Update artifact (with new substat)
      return {
        ...prevChar,
        [slotKey]: updatedSlot,
      };
    });
  };

  return (
    <Card sx={{ padding: 2 }}>
      <Grid container spacing={1}>
        {/* Mainstat */}
        <Grid size={12}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant='body1'>
              {slotName + ":"}
            </Typography>

            <Typography variant='body1' align='right'>
              {charData[newCharId].mainstats[slotIndex]}
            </Typography>
          </Box>
        </Grid>

        {/* Divider */}
        <Grid size={12}>
          <Divider />
        </Grid>

        {/* Substats */}
        {[0, 1, 2].map((subIndex) => (
          <React.Fragment key={subIndex}>
            {/* Substat name */}
            <Grid size={8}>
              <Typography variant='body2'>
                {charData[newCharId].substats[subIndex]}
              </Typography>
            </Grid>

            {/* Substat input */}
            <Grid size={4}>
              <TextField
                type='number'
                name={`${slotIndex}.${subIndex}`}
                value={newCharObj[slotIndex][subIndex]}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers with up to 1 decimal place
                  if (/^\d*\.?\d?$/.test(value)) {
                    handleSub(e);
                  }
                }}
                size='small'
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
