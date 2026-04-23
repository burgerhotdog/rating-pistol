import { useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { CHARACTERS, WEAPONS } from '@/data';
import { CustomAvatar } from '@/components';

// ─── Inner character-select dialog ───────────────────────────────────────────

function CharacterSelectDialog({ gameId, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(CHARACTERS[gameId])
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
      <DialogTitle>Select Character</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search characters..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={1}>
          {options.map(({ id, name }) => (
            <Grid key={id}>
              <Card sx={{ width: 100 }}>
                <CardActionArea onClick={() => handleSelect(id)}>
                  <CardMedia
                    image={`${gameId}/character/${id}.webp`}
                    title={name}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Typography variant="body2" textAlign="center" noWrap>
                    {name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

// ─── Inner weapon-select dialog ───────────────────────────────────────────────

function WeaponSelectDialog({ gameId, weaponType, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(WEAPONS[gameId])
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
      <DialogTitle>Select Weapon</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search weapons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Grid container spacing={1}>
          {options.map(({ id, name }) => (
            <Grid key={id}>
              <Card sx={{ width: 100 }}>
                <CardActionArea onClick={() => handleSelect(id)}>
                  <CardMedia
                    image={`${gameId}/weapon/${id}.webp`}
                    title={name}
                    sx={{ width: 100, height: 100 }}
                  />
                  <Typography variant="body2" textAlign="center" noWrap>
                    {name}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

// ─── Thumbnail button shared between character and weapon ─────────────────────

function PickerButton({ label, imageUrl, name, onClick }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Card sx={{ width: 80 }}>
        <CardActionArea onClick={onClick}>
          {imageUrl ? (
            <CardMedia
              image={imageUrl}
              title={name}
              sx={{ width: 80, height: 80 }}
            />
          ) : (
            <Box
              sx={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover',
              }}
            >
              <Typography variant="caption" color="text.secondary" textAlign="center">
                None
              </Typography>
            </Box>
          )}
        </CardActionArea>
      </Card>
      <Typography variant="caption" noWrap sx={{ maxWidth: 80 }}>
        {name ?? '—'}
      </Typography>
    </Box>
  );
}

// ─── Main TeamMemberDialog ────────────────────────────────────────────────────

export function TeamMemberDialog({ gameId, member, open, onClose, onSave }) {
  const [draft, setDraft] = useState(member);
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [weaponDialogOpen, setWeaponDialogOpen] = useState(false);

  // Keep draft in sync when member prop changes (e.g. dialog re-opened for different slot)
  useMemo(() => { setDraft(member); }, [member]);

  const characterData = CHARACTERS[gameId]?.[draft?.characterId];
  const weaponData = WEAPONS[gameId]?.[draft?.weaponId];
  const weaponType = characterData?.type ?? null;

  const handleCharacterSelect = (charId) => {
    const preset = CHARACTERS[gameId]?.[charId]?.preset;
    setDraft({
      characterId: charId,
      weaponId: preset?.weaponId ?? null,
      setId: preset?.setBonuses?.[0]?.[0] ?? null,
      rotation: null,
    });
  };

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const handleCancel = () => {
    setDraft(member);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="xs">
        <DialogTitle>Configure Team Member</DialogTitle>

        <DialogContent>
          <Box display="flex" gap={3} flexWrap="wrap" mt={1}>
            {/* Character */}
            <PickerButton
              label="Character"
              imageUrl={draft?.characterId ? `${gameId}/character/${draft.characterId}.webp` : null}
              name={characterData?.name ?? null}
              onClick={() => setCharDialogOpen(true)}
            />

            {/* Weapon */}
            <PickerButton
              label="Weapon"
              imageUrl={draft?.weaponId ? `${gameId}/weapon/${draft.weaponId}.webp` : null}
              name={weaponData?.name ?? null}
              onClick={() => setWeaponDialogOpen(true)}
            />
          </Box>

          <Box mt={3} display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Set: <Typography component="span" variant="body2">{draft?.setId ?? '—'}</Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rotation: <Typography component="span" variant="body2">{draft?.rotation ?? '—'}</Typography>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <CharacterSelectDialog
        gameId={gameId}
        open={charDialogOpen}
        onClose={() => setCharDialogOpen(false)}
        onSelect={handleCharacterSelect}
      />

      <WeaponSelectDialog
        gameId={gameId}
        weaponType={weaponType}
        open={weaponDialogOpen}
        onClose={() => setWeaponDialogOpen(false)}
        onSelect={(weaponId) => setDraft(prev => ({ ...prev, weaponId }))}
      />
    </>
  );
}
