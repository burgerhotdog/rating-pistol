import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CHARACTER, ELEMENT, TYPE } from '@/data';

const CharacterSelect = ({ open, onClose, onSelect }) => {
  const { gameId } = useParams();
  const elements = Object.values(ELEMENT[gameId]);
  const types = Object.values(TYPE[gameId]);

  const [search, setSearch] = useState('');
  const searchLower = search.toLowerCase();

  const [elementFilter, setElementFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);

  const entries = useMemo(
    () => Object.values(CHARACTER[gameId])
      .map((char) => ({ ...char, iconSrc: `${gameId}/character/${char.id}.webp` }))
      .sort((a, b) =>
        b.quality - a.quality ||
        b.version - a.version ||
        Number(b.id) - Number(a.id)
      ),
    [gameId],
  );

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
    setSearch('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth 
      slotProps={{
        transition: {
          onExited: () => setSearch(''),
        },
      }}
    >
      <DialogTitle>
        Select a character
        <Stack direction="row" spacing={1}>
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
            {elements.map(({ id, icon }) => (
              <ToggleButton key={id} value={id}>
                <img src={icon} alt="" width={24} height={24} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={typeFilter}
            onChange={(_, value) => setTypeFilter(value)}
          >
            {types.map(({ id, icon }) => (
              <ToggleButton key={id} value={id}>
                <img src={icon} alt="" width={24} height={24} />
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
          {options.map(({ id, name, iconSrc }) => (
            <Card key={id}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={iconSrc}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" sx={{ textAlign: 'center', px: 0.5 }} noWrap>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}

          {options.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No results available.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>

      </DialogActions>
    </Dialog>
  );
};

export default CharacterSelect;
