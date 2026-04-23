import { useEffect, useMemo, useState } from 'react';
import {
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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { CHARACTERS, WEAPONS } from '@/data';
import { getSkill, getSkillList } from '@/utils';

function getDefaultRotation(gameId, characterId) {
  const calcsList = CHARACTERS[gameId]?.[characterId]?.calcs ?? [];
  const calcWithRotation = calcsList.find(calc => Array.isArray(calc?.rotation));
  return calcWithRotation ? [...calcWithRotation.rotation] : [];
}

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

function SkillSelectDialog({ gameId, characterId, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    if (!characterId) return [];
    let keys = [];
    try {
      keys = getSkillList(gameId, characterId);
    } catch {
      return [];
    }

    const lower = search.toLowerCase();
    return keys
      .map(skillKey => {
        try {
          const skill = getSkill(gameId, characterId, skillKey);
          return { skillKey, name: skill.name };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .filter(({ name, skillKey }) => {
        const text = `${name} ${skillKey}`.toLowerCase();
        return text.includes(lower);
      });
  }, [gameId, characterId, search]);

  const handleSelect = (skillKey) => {
    onSelect(skillKey);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Select Skill</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Stack spacing={1}>
          {options.map(({ skillKey, name }) => (
            <Button
              key={skillKey}
              variant="outlined"
              onClick={() => handleSelect(skillKey)}
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              {name}
            </Button>
          ))}

          {options.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No skills available for this character.
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

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

function RotationEditor({ gameId, characterId, rotation, onChange }) {
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);

  const normalizedRotation = Array.isArray(rotation) ? rotation : [];
  const defaultRotation = useMemo(
    () => (characterId ? getDefaultRotation(gameId, characterId) : []),
    [gameId, characterId]
  );

  const skillNameByKey = useMemo(() => {
    if (!characterId) return {};
    let keys = [];
    try {
      keys = getSkillList(gameId, characterId);
    } catch {
      return {};
    }

    const entries = keys.map(skillKey => {
      try {
        return [skillKey, getSkill(gameId, characterId, skillKey).name];
      } catch {
        return [skillKey, skillKey];
      }
    });
    return Object.fromEntries(entries);
  }, [gameId, characterId]);

  const moveSkill = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= normalizedRotation.length) return;
    const next = [...normalizedRotation];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  const removeSkill = (index) => {
    onChange(normalizedRotation.filter((_, i) => i !== index));
  };

  if (!characterId) {
    return (
      <Typography variant="body2" color="text.secondary">
        Select a character to edit rotation.
      </Typography>
    );
  }

  return (
    <Box mt={2.5}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Rotation
      </Typography>

      <List dense sx={{ p: 0 }}>
        {normalizedRotation.map((skillKey, index) => (
          <ListItem
            key={`${skillKey}-${index}`}
            secondaryAction={
              <Stack direction="row" spacing={0.5}>
                <IconButton size="small" onClick={() => moveSkill(index, -1)}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => moveSkill(index, 1)}>
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => removeSkill(index)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            }
            sx={{ py: 0.25, pr: 14 }}
          >
            <ListItemText
              primary={`${index + 1}. ${skillNameByKey[skillKey] ?? skillKey}`}
              secondary={skillKey}
            />
          </ListItem>
        ))}
      </List>

      {normalizedRotation.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Rotation is empty.
        </Typography>
      )}

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setSkillDialogOpen(true)}
        >
          Add Skill
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(defaultRotation)}
        >
          Reset Default
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={() => onChange([])}
        >
          Clear
        </Button>
      </Stack>

      <SkillSelectDialog
        gameId={gameId}
        characterId={characterId}
        open={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onSelect={(skillKey) => onChange([...normalizedRotation, skillKey])}
      />
    </Box>
  );
}

export function TeamMemberDialog({ gameId, member, open, onClose, onSave }) {
  const EMPTY_MEMBER = {
    characterId: null,
    weaponId: null,
    setId: null,
    rotation: [],
  };

  const [draft, setDraft] = useState(member ?? EMPTY_MEMBER);
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [weaponDialogOpen, setWeaponDialogOpen] = useState(false);

  useEffect(() => {
    setDraft(member ?? EMPTY_MEMBER);
  }, [member]);

  const characterData = CHARACTERS[gameId]?.[draft?.characterId];
  const weaponData = WEAPONS[gameId]?.[draft?.weaponId];
  const weaponType = characterData?.type ?? null;

  const handleCharacterSelect = (charId) => {
    const preset = CHARACTERS[gameId]?.[charId]?.preset;
    setDraft({
      characterId: charId,
      weaponId: preset?.weaponId ?? null,
      setId: preset?.setBonuses?.[0]?.[0] ?? null,
      rotation: getDefaultRotation(gameId, charId),
    });
  };

  const handleSave = () => {
    onSave({
      ...draft,
      rotation: [...(draft?.rotation ?? [])],
    });
    onClose();
  };

  const handleCancel = () => {
    setDraft(member ?? EMPTY_MEMBER);
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
          </Box>

          <RotationEditor
            gameId={gameId}
            characterId={draft?.characterId}
            rotation={draft?.rotation}
            onChange={(rotation) => setDraft(prev => ({ ...prev, rotation }))}
          />
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
