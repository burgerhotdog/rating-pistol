import { useState } from 'react';
import { Box, Stack, Divider, Tooltip, IconButton, Popover, Typography } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import { FILTER_ASSETS } from '@assets';
import { INFO_DATA } from '@data';

export default ({ gameId, fRaritys, setFRaritys, fElements, setFElements, fTypes, setFTypes }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { ELEMENT_TYPES, WEAPON_TYPES } = INFO_DATA[gameId];

  const handleRarity = (rarity) => {
    if (fRaritys.includes(rarity)) {
      setFRaritys(fRaritys.filter(r => r !== rarity));
    } else {
      setFRaritys([...fRaritys, rarity]);
    }
  };

  const handleElement = (element) => {
    if (fElements.includes(element)) {
      setFElements(fElements.filter(e => e !== element));
    } else {
      setFElements([...fElements, element]);
    }
  };

  const handleType = (type) => {
    if (fTypes.includes(type)) {
      setFTypes(fTypes.filter(t => t !== type));
    } else {
      setFTypes([...fTypes, type]);
    }
  };

  return (
    <>
      <Tooltip title="Filter">
        <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <FilterAlt />
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{ paper: { sx: { border: '1px solid rgba(255, 255, 255, 0.1)' }}}}
      >
        <Stack minWidth={200} p={2} gap={1} sx={{ backgroundColor: 'background.default' }}>
          <Box display="flex" gap={1}>
            {[5, 4].map((rarity) => (
              <Tooltip title={`${rarity}-Star`}>
                <IconButton
                  key={rarity}
                  onClick={() => handleRarity(rarity)}
                  sx={{
                    p: 0.5,
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    border: fRaritys.includes(rarity) ? '2px solid' : '1px solid',
                    borderColor: fRaritys.includes(rarity) ? 'primary.main' : 'text.disabled',
                  }}
                >
                  <Typography variant="body2">{rarity}✦</Typography>
                </IconButton>
              </Tooltip>
            ))}
          </Box>
          <Divider />
          <Box display="flex" gap={1}>
            {ELEMENT_TYPES.map((element) => (
              <Tooltip title={element}>
                <IconButton
                  key={element}
                  onClick={() => handleElement(element)}
                  sx={{
                    p: 0.5,
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    border: fElements.includes(element) ? '2px solid' : '1px solid',
                    borderColor: fElements.includes(element) ? 'primary.main' : 'text.disabled',
                  }}
                >
                  <Box
                    component="img"
                    src={FILTER_ASSETS[gameId][element]}
                    alt={element}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
          <Divider />
          <Box display="flex" gap={1}>
            {WEAPON_TYPES.map((type) => (
              <Tooltip title={type}>
                <IconButton
                  key={type}
                  onClick={() => handleType(type)}
                  sx={{
                    p: 0.5,
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    border: fTypes.includes(type) ? '2px solid' : '1px solid',
                    borderColor: fTypes.includes(type) ? 'primary.main' : 'text.disabled',
                  }}
                >
                  <Box
                    component="img"
                    src={FILTER_ASSETS[gameId][type]}
                    alt={type}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Stack>
      </Popover>
    </>
  );
};
