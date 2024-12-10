import React from 'react';
import Grid from '@mui/material/Grid2';
import {
  Card,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const SlotCard = ({
  slotName,
  slotNumber,
  slotMainStats,
  slotSubStats,
  newCharacter,
  handleArtifact,
  isDisabled,
}) => (
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
          size='small'
          disabled={isDisabled}
          displayEmpty
          fullWidth
          sx={{
            height: '32px'
          }}
        >
          <MenuItem value='' disabled>
            (main)
          </MenuItem>
          {slotMainStats.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={8}>
        <Select
          name={`slot${slotNumber}.subStatName1`}
          value={newCharacter[`slot${slotNumber}`].subStatName1}
          onChange={handleArtifact}
          size='small'
          fullWidth
          displayEmpty
          sx={{
            height: '24px'
          }}
        >
          <MenuItem value='' disabled>
            (sub)
          </MenuItem>
          {slotSubStats.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={4}>
        <TextField
          type="number"
          name={`slot${slotNumber}.subStatValue1`}
          value={newCharacter[`slot${slotNumber}`].subStatValue1}
          onChange={handleArtifact}
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
      <Grid size={8}>
        <Select
          name={`slot${slotNumber}.subStatName2`}
          value={newCharacter[`slot${slotNumber}`].subStatName2}
          onChange={handleArtifact}
          size='small'
          fullWidth
          displayEmpty
          sx={{
            height: '24px'
          }}
        >
          <MenuItem value='' disabled>
            (sub)
          </MenuItem>
          {slotSubStats.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={4}>
        <TextField
          type="number"
          name={`slot${slotNumber}.subStatValue2`}
          value={newCharacter[`slot${slotNumber}`].subStatValue2}
          onChange={handleArtifact}
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
      <Grid size={8}>
        <Select
          name={`slot${slotNumber}.subStatName3`}
          value={newCharacter[`slot${slotNumber}`].subStatName3}
          onChange={handleArtifact}
          size='small'
          fullWidth
          displayEmpty
          sx={{
            height: '24px'
          }}
        >
          <MenuItem value='' disabled>
            (sub)
          </MenuItem>
          {slotSubStats.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={4}>
        <TextField
          type="number"
          name={`slot${slotNumber}.subStatValue3`}
          value={newCharacter[`slot${slotNumber}`].subStatValue3}
          onChange={handleArtifact}
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
      <Grid size={8}>
        <Select
          name={`slot${slotNumber}.subStatName4`}
          value={newCharacter[`slot${slotNumber}`].subStatName4}
          onChange={handleArtifact}
          size='small'
          fullWidth
          displayEmpty
          sx={{
            height: '24px'
          }}
        >
          <MenuItem value='' disabled>
            (sub)
          </MenuItem>
          {slotSubStats.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid size={4}>
        <TextField
          type="number"
          name={`slot${slotNumber}.subStatValue4`}
          value={newCharacter[`slot${slotNumber}`].subStatValue4}
          onChange={handleArtifact}
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
    </Grid>
  </Card>
);

export default SlotCard;
