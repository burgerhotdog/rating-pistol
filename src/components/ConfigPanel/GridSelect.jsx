import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CHARACTER, WEAPON, SET } from '@/data';

export function CharacterSelectDialog({ gameId, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(CHARACTER[gameId])
      .filter(([_, { name }]) => name.toLowerCase().includes(lower))
      .map(([id, { name }]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search]);

  const handleSelect = (id) => {
    onSelect(id);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        Select Character
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search characters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {options.map(({ id, name }) => (
            <Card key={id} sx={{ width: 100 }}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={`${gameId}/character/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" sx={{ textAlign: 'center' }} noWrap>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export function WeaponSelectDialog({ gameId, weaponType, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(WEAPON[gameId])
      .filter(([_, w]) =>
        (!weaponType || w.type === weaponType) &&
        w.name.toLowerCase().includes(lower)
      )
      .map(([id, w]) => ({ id, name: w.name, quality: w.quality }))
      .sort((a, b) => Number(b.quality) - Number(a.quality) || a.name.localeCompare(b.name));
  }, [gameId, weaponType, search]);

  const handleSelect = (id) => {
    onSelect(id);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        Select Weapon
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          placeholder="Search weapons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {options.map(({ id, name }) => (
            <Card key={id} sx={{ width: 100 }}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={`${gameId}/weapon/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" sx={{ textAlign: 'center' }} noWrap>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export const SetSelectDialog = ({ gameId, open, onClose, onSelect, remainingCapacity }) => {
  const [search, setSearch] = useState('');

  const allTiers = useMemo(() => {
    const tiers = new Set();

    for (const setId in SET[gameId]) {
      const set = SET[gameId][setId];

      for (const tier in set.bonusEffects) {
        tiers.add(Number(tier));
      }
    }

    return [...tiers].sort((a, b) => b - a);
  }, [gameId]);

  // Which tiers are possible given remaining capacity
  const enabledTiers = useMemo(() =>
    new Set(allTiers.filter((t) => t <= remainingCapacity))
  , [allTiers, remainingCapacity]);

  const [tierFilter, setTierFilter] = useState(allTiers[0]);

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(SET[gameId])
      .filter(([_, setData]) => {
        const bonusKeys = Object.keys(setData?.bonusEffects ?? {}).map(Number);
        // Must have at least one bonus tier matching the filter (if set) and within capacity
        const hasMatchingTier = tierFilter
          ? bonusKeys.includes(tierFilter) && enabledTiers.has(tierFilter)
          : bonusKeys.some((k) => enabledTiers.has(k));
        return hasMatchingTier && setData.name.toLowerCase().includes(lower);
      })
      .map(([id, setData]) => ({ id, name: setData.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search, tierFilter, enabledTiers]);

  const handleSelect = (id) => {
    onSelect(id, tierFilter);
    setSearch('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        transition: {
          onExited: () => {
            setSearch('');
            setTierFilter(allTiers[0]);
          }
        }
      }}
    >
      <DialogTitle>
        Select Set
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.disabled',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Piece-count filter */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ flexShrink: 0 }}>
            Piece bonus:
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={tierFilter}
            onChange={(_, val) => { if (val !== null) setTierFilter(val); }}
          >
            {allTiers.map((tier) => (
              <ToggleButton
                key={tier}
                value={tier}
                disabled={!enabledTiers.has(tier)}
              >
                {tier}pc
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search sets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
            width: 'fit-content',
            maxWidth: '100%',
            mx: 'auto',
          }}
        >
          {options.map(({ id, name }) => (
            <Card key={id} sx={{ width: 100 }}>
              <CardActionArea onClick={() => handleSelect(id)}>
                <CardMedia
                  image={`${gameId}/set/${id}.webp`}
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
              No sets available.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const GridSelectDialog = ({ mode, ...rest }) => {
  switch (mode) {
    case 'character':
      return CharacterSelectDialog(rest);
    case 'weapon':
      return WeaponSelectDialog(rest);
    case 'set':
      return SetSelectDialog(rest);
  }
};
