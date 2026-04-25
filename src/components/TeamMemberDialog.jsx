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
  Chip,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import { CHARACTERS, WEAPONS, SETS, MISC } from '@/data';
import { getSkill, getSkillList } from '@/utils';

function getDefaultRotation(gameId, characterId) {
  return CHARACTERS[gameId]?.[characterId]?.preset?.rotation ?? [];
}

function getDefaultSetBonuses(gameId, characterId) {
  const raw = CHARACTERS[gameId]?.[characterId]?.preset?.setBonuses ?? [];
  return raw.map(([setId, pieces]) => [String(setId), Number(pieces)]);
}

function getSetCapacity(gameId) {
  if (gameId === 'honkai-star-rail' || gameId === 'zenless-zone-zero') return 6;
  return 5;
}

function normalizeSetBonuses(setBonuses, gameId) {
  const capacity = getSetCapacity(gameId);
  const seen = new Set();
  const normalized = [];
  let used = 0;

  for (const entry of setBonuses ?? []) {
    if (!Array.isArray(entry) || entry.length < 2) continue;
    const setId = String(entry[0]);
    const pieces = Number(entry[1]);
    if (!setId || !Number.isFinite(pieces) || pieces <= 0) continue;

    const key = `${setId}-${pieces}`;
    if (seen.has(key)) continue;
    if (used + pieces > capacity) continue;

    seen.add(key);
    normalized.push([setId, pieces]);
    used += pieces;
  }

  return normalized;
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
      <DialogTitle sx={{ pr: 6 }}>
        Select Character
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
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
                <Typography variant="body2" textAlign="center" noWrap>
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
      <DialogTitle sx={{ pr: 6 }}>
        Select Weapon
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search weapons..."
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
                  image={`${gameId}/weapon/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" textAlign="center" noWrap>
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
        } catch (err) {
          console.log(err);
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
  const abilityTypeLabels = MISC[gameId]?.ABILITY_TYPES ?? {};

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
        const { name, input } = getSkill(gameId, characterId, skillKey);
        return [skillKey, { name, input }];
      } catch {
        return [skillKey, { name: skillKey, input: null }];
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

      <Box
        sx={{
          maxHeight: 220,
          overflowY: 'auto',
          pr: 0.5,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
        }}
      >
        <List dense sx={{ p: 0.5 }}>
          {normalizedRotation.map((skillKey, index) => {
            const skillData = skillNameByKey[skillKey] ?? { name: skillKey, input: null };
            return (
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
                <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                  <Box sx={{ width: 128, flexShrink: 0 }}>
                    {skillData.input ? (
                      <Chip
                        size="small"
                        label={abilityTypeLabels[skillData.input] ?? skillData.input}
                        variant="outlined"
                        sx={{ height: 20, maxWidth: '100%' }}
                      />
                    ) : null}
                  </Box>
                  <Typography variant="body2" noWrap>
                    {skillData.name}
                  </Typography>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </Box>

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

function SetBonusEditor({ gameId, characterId, setBonuses, onChange }) {
  const normalized = Array.isArray(setBonuses) ? setBonuses : [];
  const setMap = SETS[gameId] ?? {};
  const capacity = getSetCapacity(gameId);
  const usedPieces = normalized.reduce((acc, [_, pieces]) => acc + Number(pieces || 0), 0);

  const setOptions = useMemo(() => {
    return Object.entries(setMap)
      .filter(([_, setData]) => Object.keys(setData?.setBonus ?? {}).length > 0)
      .map(([id, setData]) => ({ id: String(id), name: setData.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [setMap]);

  const getPieceOptionsForSet = (setId) => {
    const keys = Object.keys(setMap?.[setId]?.setBonus ?? {});
    return keys.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  };

  const updateRows = (nextRows) => onChange(normalizeSetBonuses(nextRows, gameId));

  const updateSetId = (index, setId) => {
    const next = [...normalized];
    const maxAllowed = capacity - (usedPieces - Number(next[index][1] || 0));
    const pieceOptions = getPieceOptionsForSet(setId).filter(p => p <= maxAllowed);
    const nextPieces = pieceOptions[0] ?? getPieceOptionsForSet(setId)[0] ?? 0;
    next[index] = [setId, nextPieces];
    updateRows(next);
  };

  const updatePieces = (index, pieces) => {
    const next = [...normalized];
    next[index] = [next[index][0], Number(pieces)];
    updateRows(next);
  };

  const removeRow = (index) => {
    updateRows(normalized.filter((_, i) => i !== index));
  };

  const addRow = () => {
    const remaining = capacity - usedPieces;
    if (remaining <= 0) return;

    for (const option of setOptions) {
      const pieceOptions = getPieceOptionsForSet(option.id).filter(p => p <= remaining);
      if (!pieceOptions.length) continue;
      updateRows([...normalized, [option.id, pieceOptions[0]]]);
      return;
    }
  };

  if (!characterId) {
    return (
      <Typography variant="body2" color="text.secondary">
        Select a character to edit set bonuses.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Set Bonuses
      </Typography>

      <Stack spacing={1}>
        {normalized.map(([setId, pieces], index) => {
          const maxAllowed = capacity - (usedPieces - Number(pieces || 0));
          const pieceOptions = getPieceOptionsForSet(setId).filter(p => p <= maxAllowed);
          const pieceValue = pieceOptions.includes(Number(pieces))
            ? Number(pieces)
            : (pieceOptions[0] ?? '');

          return (
            <Stack key={`${setId}-${index}`} direction="row" spacing={1} alignItems="center">
              <TextField
                select
                size="small"
                label="Set"
                value={setId}
                onChange={e => updateSetId(index, e.target.value)}
                sx={{ minWidth: 180 }}
              >
                {setOptions.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label="Bonus"
                value={pieceValue}
                onChange={e => updatePieces(index, e.target.value)}
                sx={{ width: 110 }}
              >
                {pieceOptions.map(count => (
                  <MenuItem key={count} value={count}>
                    {count}pc
                  </MenuItem>
                ))}
              </TextField>

              <IconButton size="small" onClick={() => removeRow(index)}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>

      {normalized.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          No set bonuses selected.
        </Typography>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Pieces used: {usedPieces}/{capacity}
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addRow}
          disabled={usedPieces >= capacity}
        >
          Add Set Bonus
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(getDefaultSetBonuses(gameId, characterId))}
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
    </Box>
  );
}

export function TeamMemberDialog({ gameId, member, open, onClose, onSave }) {
  const EMPTY_MEMBER = {
    characterId: null,
    weaponId: null,
    setId: null,
    setBonuses: [],
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
    const defaultSetBonuses = getDefaultSetBonuses(gameId, charId);
    const preset = CHARACTERS[gameId]?.[charId]?.preset;
    setDraft({
      characterId: charId,
      weaponId: preset?.weaponId ?? null,
      setId: defaultSetBonuses[0]?.[0] ?? null,
      setBonuses: defaultSetBonuses,
      rotation: getDefaultRotation(gameId, charId),
    });
  };

  const handleSave = () => {
    const normalizedSetBonuses = normalizeSetBonuses(draft?.setBonuses, gameId);
    onSave({
      ...draft,
      setId: normalizedSetBonuses?.[0]?.[0] ?? null,
      setBonuses: normalizedSetBonuses,
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
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Configure Team Member</DialogTitle>

        <DialogContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" mt={1}>
            <Stack direction="row" spacing={2}>
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
            </Stack>

            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
              <SetBonusEditor
                gameId={gameId}
                characterId={draft?.characterId}
                setBonuses={draft?.setBonuses}
                onChange={(setBonuses) => setDraft(prev => ({
                  ...prev,
                  setBonuses,
                  setId: setBonuses?.[0]?.[0] ?? null,
                }))}
              />
            </Box>
          </Stack>

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
