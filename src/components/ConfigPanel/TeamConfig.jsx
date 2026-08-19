import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import {
  WeapAutocomplete,
  SetAutocomplete,
  EchoAutocomplete,
} from '../Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import { WW, CHARACTER } from '@/data';
import {
  formatStr,
  getMemberPreset,
  getDefaultWeapRank,
  applyStoredBuild,
} from '@/utils';
import { useBuild } from '@/contexts';
import { CharacterSelectDialog } from './GridSelect';

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

export const TeamConfig = ({ gameId, member, open, onClose, onSave }) => {
  const { charId } = useParams();
  const allBuilds = useBuild().getBuilds(gameId);

  const [draft, setDraft] = useState(member);
  const [charDialogOpen, setCharDialogOpen] = useState(false);

  useEffect(() => setDraft(member), [member]);

  const memberData = CHARACTER[gameId][draft.id];
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
      <Dialog open={open} onClose={handleCancel} maxWidth="sm">
        <DialogTitle>
          Configure Team Member
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

          <Stack spacing={1}>
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
            </Stack>

            <Stack direction="row" spacing={1}>
              <WeapAutocomplete
                gameId={gameId}
                type={weaponType}
                selected={draft.weaponId}
                onChange={(weaponId) => setDraft((prev) => ({
                  ...prev,
                  weaponId,
                  weaponRank: weaponId && getDefaultWeapRank(gameId, weaponId),
                }))}
                label="Weapon"
                disabled={buildLocked || !draft.id}
                fullWidth
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

            <SetAutocomplete
              gameId={gameId}
              setCounts={draft.setCounts}
              onChange={(value) => setDraft((prev) => ({ ...prev, setCounts: value }))}
              label="Set Bonuses"
              disabled={buildLocked || !draft.id}
            />

            {gameId === WW && (
              <EchoAutocomplete
                sets={Object.keys(draft.setCounts)}
                selected={draft.mainEcho ?? null}
                onChange={(mainEcho) => setDraft((prev) => ({ ...prev, mainEcho }))}
                label="Main Echo"
                disabled={buildLocked || !draft.id}
              />
            )}

            {gameId === WW && CHARACTER[gameId][draft.id]?.modes && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Resonance Mode
                </Typography>
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
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
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
    </>
  );
};
