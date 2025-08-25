import { useState, useMemo } from 'react';
import { Skeleton, Stack, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, Typography, IconButton, Tooltip, Box, FormGroup, FormControlLabel, Checkbox, Divider } from '@mui/material';
import { FilterAlt } from '@mui/icons-material';
import { AVATAR_DATA, INFO_DATA } from '@data';
import StarCell from './StarCell';
import AvatarCell from './AvatarCell';
import RatingCell from './RatingCell';

const CustomTable = ({ gameId, userId, avatarCache, setAvatarCache, isLoading, setModalPipe }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedElements, setSelectedElements] = useState([...INFO_DATA[gameId].ELEMENT_TYPES]);
  const [selectedTypes, setSelectedTypes] = useState([...INFO_DATA[gameId].WEAPON_TYPES]);

  const sortedAvatars = useMemo(() => (  
    Object.entries(avatarCache)
      .sort(([, a], [, b]) => {
        if (a.data.isStar !== b.data.isStar) return a.data.isStar ? -1 : 1;

        if (!a.rating && !b.rating) {
          if ((a.rating === null) === (b.rating === null)) return 0;
          return a.rating === null ? -1 : 1;
        }

        if (!a.rating) return 1;
        if (!b.rating) return -1;

        return ((b.rating.score / (b.rating.scoreMax / 2)) * 100) - ((a.rating.score / (a.rating.scoreMax / 2)) * 100);
      })
      .map(([avatarId]) => avatarId)
  ), [avatarCache]);

  const handleElementChange = (element) => {
    if (selectedElements.includes(element)) {
      setSelectedElements(selectedElements.filter(e => e !== element));
    } else {
      setSelectedElements([...selectedElements, element]);
    }
  };

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const filteredAvatars = useMemo(() => {
    return sortedAvatars.filter(avatarId => {
      const avatarData = AVATAR_DATA[gameId][avatarId];
      return selectedElements.includes(avatarData.element) && selectedTypes.includes(avatarData.type);
    });
  }, [sortedAvatars, selectedElements, selectedTypes, gameId]);

  const FilterTooltip = () => (
    <Box sx={{ p: 2, minWidth: 200 }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        Elements
      </Typography>
      <FormGroup>
        {INFO_DATA[gameId].ELEMENTS.map((element) => (
          <FormControlLabel
            key={element}
            control={
              <Checkbox
                checked={selectedElements.includes(element)}
                onChange={() => handleElementChange(element)}
                size="small"
              />
            }
            label={element}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
          />
        ))}
      </FormGroup>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        Weapon Types
      </Typography>
      <FormGroup>
        {INFO_DATA[gameId].TYPES.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                size="small"
              />
            }
            label={type}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <TableContainer 
      component={Paper}
      sx={{
        maxHeight: 650,
        overflow: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Table stickyHeader sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell width={50}>
              <Tooltip
                title={<FilterTooltip />}
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                onOpen={() => setFilterOpen(true)}
                placement="bottom-start"
                disableHoverListener
                disableFocusListener
                disableTouchListener
                slotProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      border: '1px solid',
                      borderColor: 'divider',
                      boxShadow: 3,
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <FilterAlt />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Character
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body1" fontWeight="bold">
                Substat Score
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            [...Array(10)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" display="inline-flex" spacing={1}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={120} height={36} />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Skeleton variant="rounded" width={60} height={36} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            filteredAvatars.map((avatarId) => (
              <TableRow
                key={avatarId}
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)' } }}
              >
                <StarCell
                  gameId={gameId}
                  userId={userId}
                  setAvatarCache={setAvatarCache}
                  id={avatarId}
                  data={avatarCache[avatarId].data}
                />
                <AvatarCell
                  gameId={gameId}
                  setModalPipe={setModalPipe}
                  id={avatarId}
                  data={avatarCache[avatarId].data}
                />
                <RatingCell
                  gameId={gameId}
                  setModalPipe={setModalPipe}
                  id={avatarId}
                  data={avatarCache[avatarId].data}
                  rating={avatarCache[avatarId].rating}
                />
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;