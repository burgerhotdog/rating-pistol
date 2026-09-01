import { useMemo, useState } from 'react';
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
import { useData } from '@/hooks';
import { formatStr } from '@/utils';

const CharacterPickerDialog = ({ open, onClose, onSelect, allyIds }) => {
  const characters = useData('character');
  const elements = useData('element');
  const types = useData('type');

  const [search, setSearch] = useState('');
  const [elementFilter, setElementFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);

  const entries = useMemo(
    () => Object.values(characters)
      .sort((a, b) =>
        b.quality - a.quality ||
        b.version - a.version ||
        b.id - a.id
      ),
    [characters],
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth 
      slotProps={{
        transition: {
          onEnter: () => {
            setSearch('');
            setElementFilter([]);
            setTypeFilter([]);
          },
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
            {Object.values(elements).map(({ key, icon }) => (
              <ToggleButton key={key} value={key} title={formatStr(key)}>
                <img
                  src={icon}
                  alt=""
                  style={{ width: 24, height: 24 }}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={typeFilter}
            onChange={(_, value) => setTypeFilter(value)}
          >
            {Object.values(types).map(({ key, icon }) => (
              <ToggleButton key={key} value={key} title={formatStr(key)}>
                <img
                  src={icon}
                  alt=""
                  style={{ width: 24, height: 24 }}
                />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ height: '80vh', scrollbarGutter: 'stable' }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 100px)',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {options.map(({ id, name, icon }) => {
            const isDisabled = allyIds.includes(id);
            return (
              <Card key={id} title={name}>
                <CardActionArea
                  onClick={() => {
                    onSelect(id);
                    onClose();
                  }}
                  disabled={isDisabled}
                >
                  <CardMedia
                    component="img"
                    src={icon}
                    alt={name}
                    loading="lazy"
                    sx={{ width: 100, height: 100, filter: isDisabled && 'brightness(60%)' }}
                  />
                  <Typography
                    variant="body2"
                    noWrap
                    color={isDisabled && 'textDisabled'}
                    sx={{ textAlign: 'center', px: 1 }}
                  >
                    {name}
                  </Typography>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterPickerDialog;
