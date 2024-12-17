import React from 'react';
import Grid from '@mui/material/Grid2';
import { Card, TextField, Typography } from '@mui/material';
import characterMains from '../data/characterMains';
import characterSubs from '../data/characterSubs';

const SlotCard = ({
  slotName,
  slotNumber,
  newId,
  newCharacter,
  handleArtifact,
}) => {

  return (
    <Card sx={{ padding: 1 }}>
      <Grid container spacing={1}>
        <Grid size={4}>
          <Typography variant="body1">{slotName}</Typography>
        </Grid>
        <Grid size={8}>
          <Typography variant="body1">{characterMains[newId][0]}</Typography>
        </Grid>

        {[0, 1, 2].map((subIndex) => (
          <React.Fragment key={subIndex}>
            <Grid size={8}>
              <Typography variant="body2">
                {characterSubs[newId][subIndex]}
              </Typography>
            </Grid>
            <Grid size={4}>
              <TextField
                type="number"
                name={`${slotNumber}.sub${subIndex}`}
                value={newCharacter[slotNumber][`sub${subIndex}`]}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d?$/.test(value)) { // Allow only numbers with up to 1 decimal place
                    handleArtifact(e);
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
