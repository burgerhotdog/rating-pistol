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
  ToggleButton,
  ToggleButtonGroup,
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
import { getSkill, getSkillList, getMember } from '@/utils';

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

// ─── SetSelectDialog ────────────────────────────────────────────────────────

function SetSelectDialog({ gameId, open, onClose, onSelect, remainingCapacity }) {
  const [search, setSearch] = useState('');
  const [pieceFilter, setPieceFilter] = useState(null);

  // Collect all piece-count tiers that exist across all sets in this game
  const allPieceTiers = useMemo(() => {
    const tiers = new Set();
    for (const setData of Object.values(SETS[gameId])) {
      for (const key of Object.keys(setData?.setBonus ?? {})) {
        const n = Number(key);
        if (Number.isFinite(n)) tiers.add(n);
      }
    }
    return [...tiers].sort((a, b) => a - b);
  }, [gameId]);

  // Which tiers are possible given remaining capacity
  const enabledTiers = useMemo(
    () => new Set(allPieceTiers.filter(t => t <= remainingCapacity)),
    [allPieceTiers, remainingCapacity]
  );

  // Sync default filter to first enabled tier whenever dialog opens
  useEffect(() => {
    if (open) {
      const firstEnabled = allPieceTiers.find(t => enabledTiers.has(t)) ?? null;
      setPieceFilter(firstEnabled);
    }
  }, [open]);

  const options = useMemo(() => {
    const lower = search.toLowerCase();
    return Object.entries(SETS[gameId])
      .filter(([_, setData]) => {
        const bonusKeys = Object.keys(setData?.setBonus ?? {}).map(Number);
        // Must have at least one bonus tier matching the filter (if set) and within capacity
        const hasMatchingTier = pieceFilter
          ? bonusKeys.includes(pieceFilter) && enabledTiers.has(pieceFilter)
          : bonusKeys.some(k => enabledTiers.has(k));
        return hasMatchingTier && setData.name.toLowerCase().includes(lower);
      })
      .map(([id, setData]) => ({ id, name: setData.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [gameId, search, pieceFilter, enabledTiers]);

  const handleSelect = (id) => {
    onSelect(id, pieceFilter);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ pr: 6 }}>
        Select Set
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Piece-count filter */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
            Piece bonus:
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={pieceFilter}
            onChange={(_, val) => { if (val !== null) setPieceFilter(val); }}
          >
            {allPieceTiers.map(tier => (
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
          size="small"
          placeholder="Search sets..."
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
                  image={`${gameId}/set/${id}.webp`}
                  title={name}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="body2" textAlign="center" noWrap px={0.5}>
                  {name}
                </Typography>
              </CardActionArea>
            </Card>
          ))}

          {options.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No sets available.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// ─── SetIcon — single icon with hover-X and piece-count badge ───────────────

function SetIcon({ gameId, setId, pieces, onRemove, onClick }) {
  const [hovered, setHovered] = useState(false);
  const name = SETS[gameId]?.[setId]?.name ?? setId;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box position="relative">
        <Card sx={{ width: 80 }}>
          <CardActionArea onClick={onClick}>
            <CardMedia
              image={`${gameId}/set/${setId}.webp`}
              title={name}
              sx={{ width: 80, height: 80 }}
            />
          </CardActionArea>
        </Card>

        {/* Piece-count badge — bottom-left */}
        <Chip
          label={`${pieces}pc`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 2,
            left: 2,
            height: 18,
            fontSize: '0.65rem',
            pointerEvents: 'none',
            bgcolor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            '& .MuiChip-label': { px: '4px' },
          }}
        />

        {/* Remove X — top-right, visible on hover */}
        {hovered && (
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              width: 18,
              height: 18,
              '&:hover': { bgcolor: 'error.main', color: '#fff', borderColor: 'error.main' },
            }}
          >
            <CloseIcon sx={{ fontSize: 11 }} />
          </IconButton>
        )}
      </Box>

      <Typography variant="caption" noWrap sx={{ maxWidth: 80 }}>
        {name}
      </Typography>
    </Box>
  );
}

// ─── SetCountsEditor ────────────────────────────────────────────────────────

function SetCountsEditor({ gameId, memberId, setCounts, onChange }) {
  const capacity = (gameId === 'genshin-impact' || gameId === 'wuthering-waves') ? 5 : 6;
  const [dialogOpen, setDialogOpen] = useState(false);
  // Index of the set being replaced; null means we're adding a new one
  const [replacingIndex, setReplacingIndex] = useState(null);

  const entries = Object.entries(setCounts); // [[setId, pieces], ...]
  const usedPieces = entries.reduce((sum, [, n]) => sum + n, 0);

  const remainingForAdd = capacity - usedPieces;

  // Remaining capacity when replacing a specific slot (free up that slot's pieces first)
  const remainingForReplace = (index) => {
    const freed = Number(entries[index]?.[1] ?? 0);
    return capacity - usedPieces + freed;
  };

  const openAdd = () => {
    setReplacingIndex(null);
    setDialogOpen(true);
  };

  const openReplace = (index) => {
    setReplacingIndex(index);
    setDialogOpen(true);
  };

  const handleSelect = (setId, pieces) => {
    const next = { ...setCounts };

    if (replacingIndex !== null) {
      // Remove the old set at that index, add the new one
      const oldSetId = entries[replacingIndex][0];
      delete next[oldSetId];
    }

    next[setId] = pieces;
    onChange(next);
  };

  const handleRemove = (setId) => {
    const next = { ...setCounts };
    delete next[setId];
    onChange(next);
  };

  const currentRemainingCapacity =
    replacingIndex !== null ? remainingForReplace(replacingIndex) : remainingForAdd;

  if (!memberId) {
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

      <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap" useFlexGap>
        {entries.map(([setId, pieces], index) => (
          <SetIcon
            key={setId}
            gameId={gameId}
            setId={setId}
            pieces={pieces}
            onRemove={() => handleRemove(setId)}
            onClick={() => openReplace(index)}
          />
        ))}

        {/* Add button — only shown when more sets can fit */}
        {remainingForAdd > 0 && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
            <Card
              sx={{
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                boxShadow: 'none',
                bgcolor: 'transparent',
              }}
            >
              <CardActionArea
                onClick={openAdd}
                sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <AddIcon color="action" />
              </CardActionArea>
            </Card>
            <Typography variant="caption" color="text.secondary">Add set</Typography>
          </Box>
        )}
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Pieces used: {usedPieces}/{capacity}
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(getMember(gameId, memberId).setCounts)}
        >
          Reset Default
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={() => onChange({})}
        >
          Clear
        </Button>
      </Stack>

      <SetSelectDialog
        gameId={gameId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSelect={handleSelect}
        remainingCapacity={currentRemainingCapacity}
      />
    </Box>
  );
}

function SkillSelectDialog({ gameId, characterId, teamIds, open, onClose, onSelect }) {
  const [search, setSearch] = useState('');

  const options = useMemo(() => {
    if (!characterId) return [];
    let keys = [];
    try {
      keys = getSkillList(gameId, characterId);
    } catch {
      return [];
    }

    for (const memberId of teamIds) {
      if (memberId === characterId) continue;
      const memberSkillList = getSkillList(gameId, memberId).filter(skillKey => {
        const { input } = getSkill(gameId, memberId, skillKey);
        return input === "CA";
      }).map(skillKey => `${skillKey}_${memberId}`);
      keys = [...keys, ...memberSkillList];
    }

    const lower = search.toLowerCase();
    return keys
      .map(skillKey => {
        const [pureKey, ownerId] = skillKey.split('_');
        if (ownerId) {
          const skill = getSkill(gameId, ownerId, pureKey);
          return { skillKey, name: skill.name, ownerId };
        }
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
  }, [gameId, characterId, teamIds, search]);

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

function RotationEditor({ gameId, characterId, teamIds, rotation, onChange }) {
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const abilityTypeLabels = MISC[gameId]?.ABILITY_TYPES ?? {};

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
    if (nextIndex < 0 || nextIndex >= rotation.length) return;
    const next = [...rotation];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  };

  const removeSkill = (index) => {
    onChange(rotation.filter((_, i) => i !== index));
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
          {rotation.map((skillKey, index) => {
            const { input, name, ownerId } = getSkill(gameId, characterId, skillKey);
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
                  <Box sx={{ width: 200, flexShrink: 0 }}>
                    {input ? (
                      <Chip
                        size="small"
                        label={abilityTypeLabels[input] ?? input}
                        variant="outlined"
                        sx={{ height: 20, maxWidth: '100%' }}
                      />
                    ) : null}
                  </Box>
                  <Typography variant="body2" noWrap>
                    {`${ownerId !== characterId ? `${CHARACTERS[gameId][ownerId].name}: ` : ""}${name}`}
                  </Typography>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {rotation.length === 0 && (
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
          onClick={() => onChange(CHARACTERS[gameId][characterId]?.preset?.rotation ?? [])}
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
        teamIds={teamIds}
        open={skillDialogOpen}
        onClose={() => setSkillDialogOpen(false)}
        onSelect={(skillKey) => onChange([...rotation, skillKey])}
      />
    </Box>
  );
}

export function TeamMemberDialog({ gameId, member, team, open, onClose, onSave }) {
  const [draft, setDraft] = useState(member);
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [weaponDialogOpen, setWeaponDialogOpen] = useState(false);

  useEffect(() => setDraft(member), [member]);

  const memberData = CHARACTERS[gameId][draft.memberId];
  const weaponData = WEAPONS[gameId]?.[draft.weaponId];
  const weaponType = memberData?.type ?? null;

  const handleCharacterSelect = (charId) => {
    setDraft(getMember(gameId, charId));
  };

  const handleSave = () => {
    onSave({ ...draft });
    onClose();
  };

  const handleCancel = () => {
    setDraft(member);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="md">
        <DialogTitle>Configure Team Member</DialogTitle>

        <DialogContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start" mt={1}>
            <Stack direction="row" spacing={2}>
              {/* Character */}
              <PickerButton
                label="Character"
                imageUrl={`${gameId}/character/${draft.memberId}.webp`}
                name={memberData?.name ?? null}
                onClick={() => setCharDialogOpen(true)}
              />

              {/* Weapon */}
              <PickerButton
                label="Weapon"
                imageUrl={`${gameId}/weapon/${draft.weaponId}.webp`}
                name={weaponData?.name ?? null}
                onClick={() => setWeaponDialogOpen(true)}
              />
            </Stack>

            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
              <SetCountsEditor
                gameId={gameId}
                memberId={draft.memberId}
                setCounts={draft.setCounts}
                onChange={(setCounts) => setDraft(prev => ({ ...prev, setCounts }))}
              />
            </Box>
          </Stack>

          <RotationEditor
            gameId={gameId}
            characterId={draft.memberId}
            teamIds={team.map(member => member.memberId)}
            rotation={draft.rotation}
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
