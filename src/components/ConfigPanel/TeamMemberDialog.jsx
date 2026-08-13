import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CloseIcon from '@mui/icons-material/Close';
import { WW, CHARACTER, WEAPON, SET, ECHO } from '@/data';
import {
  formatStr,
  getPresetSetCounts,
  getMemberPreset,
  getDefaultWeaponRank,
  applyStoredBuild,
} from '@/utils';
import { useBuild } from '@/contexts';
import { CharacterSelectDialog, WeaponSelectDialog, SetSelectDialog } from './GridSelect';

function SetIcon({ gameId, setId, pieces, onRemove, onClick, disabled = false }) {
  const [hovered, setHovered] = useState(false);
  const name = SET[gameId]?.[setId]?.name ?? setId;

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ position: 'relative' }}>
        <Card sx={{ width: 80 }}>
          <CardActionArea onClick={onClick} disabled={disabled}>
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
        {hovered && !disabled && (
          <IconButton
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

      <Typography
        variant="caption"
        color={disabled && "textDisabled"}
        noWrap
        sx={{ maxWidth: 80 }}
      >
        {name}
      </Typography>
    </Box>
  );
}

function SetCountsEditor({ gameId, id, setCounts = {}, onChange, disabled = false }) {
  const capacity = (gameId === 'genshin-impact' || gameId === 'wuthering-waves') ? 5 : 6;
  const [dialogOpen, setDialogOpen] = useState(false);
  // Index of the set being replaced; null means we're adding a new one
  const [replacingIndex, setReplacingIndex] = useState(null);

  const entries = Object.entries(setCounts)
    .toSorted((a, b) => SET[gameId][b[0]].version - SET[gameId][a[0]].version);

  const usedPieces = entries.reduce((sum, [, n]) => sum + n, 0);

  const remainingForAdd = capacity - usedPieces;

  // Remaining capacity when replacing a specific slot (free up that slot's pieces first)
  const remainingForReplace = (index) => {
    const freed = Number(entries[index]?.[1] ?? 0);
    return capacity - usedPieces + freed;
  };

  const openAdd = () => {
    if (disabled) return;
    setReplacingIndex(null);
    setDialogOpen(true);
  };

  const openReplace = (index) => {
    if (disabled) return;
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
    replacingIndex !== null
      ? remainingForReplace(replacingIndex)
      : remainingForAdd;

  if (!id) {
    return (
      <Typography variant="body2" color="textSecondary">
        Select a character to edit set bonuses.
      </Typography>
    );
  }

  return (
    <Stack spacing={0.5}>
      <Typography
        variant="subtitle1"
        color={disabled && "textDisabled"}
      >
        Set Bonuses
      </Typography>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {entries.map(([setId, pieces], index) => (
          <SetIcon
            key={setId}
            gameId={gameId}
            setId={setId}
            pieces={pieces}
            disabled={disabled}
            onRemove={disabled ? undefined : () => handleRemove(setId)}
            onClick={disabled ? undefined : () => openReplace(index)}
          />
        ))}

        {/* Add button — only shown when more sets can fit and not disabled */}
        {!disabled && remainingForAdd > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
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
            <Typography variant="caption" color="textSecondary">
              Add set
            </Typography>
          </Box>
        )}
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 1 }}>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={() => onChange(getPresetSetCounts(gameId, id))}
          disabled={disabled}
        >
          Reset Default
        </Button>

        <Button
          variant="outlined"
          startIcon={<ClearAllIcon />}
          onClick={() => onChange({})}
          disabled={disabled}
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
    </Stack>
  );
}

function PickerButton({ label, imageUrl, name, onClick, onClear, disabled = false }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Typography
        variant="subtitle1"
        color={disabled && "textDisabled"}
      >
        {label}
      </Typography>

      <Box sx={{ position: 'relative' }}>
        <Card sx={{ width: 80 }}>
          <CardActionArea onClick={onClick} disabled={disabled}>
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
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ textAlign: 'center' }}
                >
                  None
                </Typography>
              </Box>
            )}
          </CardActionArea>
        </Card>

        {hovered && onClear && !disabled && (name || imageUrl) && (
          <IconButton
            onClick={(e) => { e.stopPropagation(); onClear(); }}
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
      <Typography
        variant="caption"
        color={disabled && "textDisabled"}
        noWrap
        sx={{ maxWidth: 80 }}
      >
        {name ?? '—'}
      </Typography>
    </Box>
  );
}

function MainEchoAutocomplete({ charId, value, onChange, disabled }) {
  const options = useMemo(() => (
    Object.values(ECHO)
      .map((e) => ({ id: e.id, label: e.name, cost: e.cost }))
      .sort((a, b) => b.cost - a.cost || a.label.localeCompare(b.label))
  ), []);

  const selected = options.find((o) => o.id === value) ?? null;

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(o) => o.label}
      value={selected}
      onChange={(_, option) => onChange(option?.id ?? null)}
      disabled={disabled || !charId}
      size="small"
      renderInput={(params) => <TextField {...params} label="Main Echo" />
      }
    />
  );
}

export function TeamMemberDialog({ gameId, member, open, onClose, onSave }) {
  const { charId } = useParams();
  const allBuilds = useBuild().getBuilds(gameId);

  const [draft, setDraft] = useState(member);
  const [charDialogOpen, setCharDialogOpen] = useState(false);
  const [weaponDialogOpen, setWeaponDialogOpen] = useState(false);

  useEffect(() => setDraft(member), [member]);

  const memberData = CHARACTER[gameId][draft.id];
  const weaponData = WEAPON[gameId]?.[draft.weaponId];
  const weaponType = memberData?.type ?? null;

  // Stored build for the current draft member (only meaningful for teammates)
  const storedBuild = draft.id && draft.id !== charId
    ? allBuilds[draft.id] ?? null
    : null;
  const isMainCharacter = draft.id === charId;
  const showToggle = storedBuild !== null;
  const buildLocked = !isMainCharacter && draft.useUserBuild === true;

  const handleToggleUserBuild = (useUserBuild) => {
    if (useUserBuild && storedBuild) {
      setDraft((prev) => applyStoredBuild(gameId, prev, storedBuild));
    } else {
      setDraft((prev) => {
        const { build: _, ...rest } = prev;
        return { ...rest, useUserBuild: false };
      });
    }
  };

  const handleSave = () => {
    if (isMainCharacter) {
      // Preserve build.equipList for simulation; weapon/rank/setCounts are what-if overrides.
      onSave(draft);
    } else if (draft.useUserBuild && storedBuild) {
      onSave({ ...draft, build: storedBuild });
    } else {
      const { build: _, ...rest } = draft;
      onSave(rest);
    }
    onClose();
  };

  const handleCancel = () => {
    setDraft(member);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configure Team Member
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

        <DialogContent dividers>
          {showToggle && (
            <FormControlLabel
              control={
                <Switch
                  checked={buildLocked}
                  onChange={(e) => handleToggleUserBuild(e.target.checked)}
                />
              }
              label={buildLocked ? 'Using own build' : 'Using trial build'}
              sx={{ mb: 1 }}
            />
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start', mt: 1 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                {/* Character */}
                <PickerButton
                  label="Character"
                  imageUrl={`${gameId}/character/${draft.id}.webp`}
                  name={memberData?.name ?? null}
                  onClick={() => setCharDialogOpen(true)}
                  onClear={() => setDraft((prev) => ({
                    ...prev,
                    id: null,
                    rank: null,
                    weaponId: null,
                    weaponRank: null,
                    setCounts: {},
                    rotation: [],
                    useUserBuild: false,
                  }))}
                />

                <TextField
                  select
                  value={draft.rank ?? ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, rank: Number(e.target.value) }))}
                  disabled={!draft.id || buildLocked}
                  sx={{ width: 120 }}
                >
                  <MenuItem value="" disabled>
                    
                  </MenuItem>
                  {[0, 1, 2, 3, 4, 5, 6].map((rank) => (
                    <MenuItem key={rank} value={rank}>
                      {`S${rank}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                {/* Weapon */}
                <PickerButton
                  label="Weapon"
                  imageUrl={`${gameId}/weapon/${draft.weaponId}.webp`}
                  name={weaponData?.name ?? null}
                  onClick={() => setWeaponDialogOpen(true)}
                  disabled={!draft.id || buildLocked}
                  onClear={buildLocked ? undefined : () => setDraft((prev) => ({
                    ...prev,
                    weaponId: null,
                    weaponRank: null,
                  }))}
                />

                <TextField
                  select
                  value={draft.weaponRank ?? ''}
                  onChange={(e) => setDraft((prev) => ({ ...prev, weaponRank: Number(e.target.value) }))}
                  disabled={!draft.weaponId || buildLocked}
                  sx={{ width: 120 }}
                >
                  <MenuItem value="" disabled>
                    
                  </MenuItem>
                  {[1, 2, 3, 4, 5].map((rank) => (
                    <MenuItem key={`weapon-rank-${rank}`} value={rank}>
                      {`S${rank}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
              <SetCountsEditor
                gameId={gameId}
                id={draft.id}
                setCounts={draft.setCounts}
                onChange={(setCounts) => setDraft((prev) => ({ ...prev, setCounts }))}
                disabled={buildLocked}
              />
            </Box>
          </Stack>

          {gameId === WW && (
            <Box sx={{ mt: 2.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Main Echo</Typography>
              <MainEchoAutocomplete
                charId={draft.id}
                value={draft.mainEcho ?? null}
                onChange={(mainEcho) => setDraft((prev) => ({ ...prev, mainEcho }))}
                disabled={buildLocked}
              />
            </Box>
          )}

          {gameId === WW && CHARACTER[gameId][draft.id]?.modes && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Resonance Mode</Typography>
              <ToggleButtonGroup
                value={draft.mode ?? CHARACTER[gameId][draft.id].modes[0]}
                onChange={(_, value) => { if (value !== null) setDraft((prev) => ({ ...prev, mode: value })); }}
                disabled={buildLocked}
              >
                {CHARACTER[gameId][draft.id].modes.map((mode) => (
                  <ToggleButton key={mode} value={mode}>
                    {formatStr(mode)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}
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
        onSelect={(charId) => {
          let nextMember = getMemberPreset(gameId, charId);
          const nextStoredBuild = allBuilds[charId] ?? null;
          if (nextStoredBuild) {
            nextMember = applyStoredBuild(gameId, nextMember, nextStoredBuild);
          }
          setDraft(nextMember);
        }}
      />

      <WeaponSelectDialog
        gameId={gameId}
        weaponType={weaponType}
        open={weaponDialogOpen}
        onClose={() => setWeaponDialogOpen(false)}
        onSelect={(weaponId) => setDraft((prev) => ({
          ...prev,
          weaponId,
          weaponRank: getDefaultWeaponRank(gameId, weaponId),
        }))}
      />
    </>
  );
}
