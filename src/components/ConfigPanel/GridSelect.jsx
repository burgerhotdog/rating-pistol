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

function SelectDialogBase({
  title,
  searchPlaceholder = 'Search...',
  entries,
  gameId,
  mode,
  open,
  onClose,
  onSelect,
  onExited,
  extraFilters,
  emptyMessage = 'No results available.',
}) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return entries.filter(({ name }) => name.toLowerCase().includes(lower));
  }, [entries, search]);

  const handleSelect = (id) => {
    onSelect(id);
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
            onExited?.();
          },
        },
      }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.disabled' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {extraFilters}

        <TextField
          fullWidth
          placeholder={searchPlaceholder}
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
                  image={`${gameId}/${mode}/${id}.webp`}
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
              {emptyMessage}
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export function CharacterSelectDialog({ gameId, open, onClose, onSelect }) {
  const entries = useMemo(() =>
    Object.values(CHARACTER[gameId])
      .sort((a, b) => a.name.localeCompare(b.name)),
    [gameId]);

  return (
    <SelectDialogBase
      title="Select Character"
      searchPlaceholder="Search characters..."
      entries={entries}
      gameId={gameId}
      mode="character"
      open={open}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
}

export function WeaponSelectDialog({ gameId, weaponType, open, onClose, onSelect }) {
  const entries = useMemo(() =>
    Object.values(WEAPON[gameId])
      .filter(({ type }) => !weaponType || type === weaponType)
      .sort((a, b) => Number(b.quality) - Number(a.quality) || a.name.localeCompare(b.name)),
    [gameId, weaponType]);

  return (
    <SelectDialogBase
      title="Select Weapon"
      searchPlaceholder="Search weapons..."
      entries={entries}
      gameId={gameId}
      mode="weapon"
      open={open}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
}

export const SetSelectDialog = ({ gameId, open, onClose, onSelect, remainingCapacity }) => {
  const allTiers = useMemo(() => {
    const tiers = new Set();
    for (const setId in SET[gameId]) {
      const set = SET[gameId][setId];
      for (const tier of set.bonuses) tiers.add(tier);
    }
    return [...tiers].sort((a, b) => b - a);
  }, [gameId]);

  const enabledTiers = useMemo(
    () => new Set(allTiers.filter((t) => t <= remainingCapacity)),
    [allTiers, remainingCapacity]
  );

  const [tierFilter, setTierFilter] = useState(allTiers[0]);

  const entries = useMemo(() => {
    return Object.values(SET[gameId])
      .filter((setData) => {
        const { bonuses } = setData;
        const hasMatchingTier = tierFilter
          ? bonuses.includes(tierFilter) && enabledTiers.has(tierFilter)
          : bonuses.some((k) => enabledTiers.has(k));
        return hasMatchingTier;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, tierFilter, enabledTiers]);

  return (
    <SelectDialogBase
      title="Select Set"
      searchPlaceholder="Search sets..."
      entries={entries}
      gameId={gameId}
      mode="set"
      open={open}
      onClose={onClose}
      onSelect={(id) => onSelect(id, tierFilter)}
      onExited={() => setTierFilter(allTiers[0])}
      emptyMessage="No sets available."
      extraFilters={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ flexShrink: 0 }}>
            Piece bonus:
          </Typography>
          <ToggleButtonGroup
            value={tierFilter}
            onChange={(_, val) => { if (val !== null) setTierFilter(val); }}
          >
            {allTiers.map((tier) => (
              <ToggleButton key={tier} value={tier} disabled={!enabledTiers.has(tier)}>
                {tier}pc
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      }
    />
  );
};
