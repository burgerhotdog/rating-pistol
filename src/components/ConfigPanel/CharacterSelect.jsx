import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CHARACTER, ELEMENTS, TYPES } from '@/data';
import { formatStr } from '@/utils';

const CharacterSelect = ({ open, onClose, onSelect }) => {
  const { gameId } = useParams();

  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const resetStates = () => {
    setSearch('');
    setElementFilter([]);
    setTypeFilter([]);
  };

  const entries = useMemo(
    () => Object.values(CHARACTER[gameId])
      .sort((a, b) =>
        b.quality - a.quality ||
        b.version - a.version ||
        Number(b.id) - Number(a.id)
      ),
    [gameId],
  );

  const searchLower = search.toLowerCase();
  const options = useMemo(
    () => entries.filter(({ name, element, type }) =>
      (!elementFilter.length || elementFilter.includes(element)) &&
      (!typeFilter.length || typeFilter.includes(type)) &&
      name.toLowerCase().includes(searchLower)
    ),
    [entries, elementFilter, typeFilter, searchLower],
  );

  const handleSelect = (id) => {
    onSelect(id);
    resetStates();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth 
      slotProps={{
        transition: {
          onExited: resetStates,
        },
      }}
    >
      <DialogTitle>
        Select a character
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            placeholder="Search character name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <ToggleButtonGroup
            value={elementFilter}
            onChange={(_, value) => setElementFilter(value)}
          >
            {ELEMENTS[gameId].map(({ key, icon }) => (
              <ToggleButton key={key} value={key} title={formatStr(key)}>
                <img
                  src={icon}
                  alt=""
                  width={24}
                  height={24}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={typeFilter}
            onChange={(_, value) => setTypeFilter(value)}
          >
            {TYPES[gameId].map(({ key, icon }) => (
              <ToggleButton key={key} value={key} title={formatStr(key)}>
                <img
                  src={icon}
                  alt=""
                  width={24}
                  height={24}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          height: '80vh',
          scrollbarGutter: 'stable',
          scrollbarWidth: 'thin',
          scrollbarColor: (theme) => `${theme.palette.grey[600]} transparent`,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 100px)',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {options.map(({ id, name, icon }) => (
            <Card key={id} title={name}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  component="img"
                  src={icon}
                  alt={name}
                  loading="lazy"
                  sx={{ width: 100, height: 100 }}
                />
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ textAlign: 'center', px: 1 }}
                >
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterSelect;
