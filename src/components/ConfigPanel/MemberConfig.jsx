import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
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

function PickerButton({ imageUrl, name, onClick, onClear, disabled = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

export const MemberConfig = ({ member, onChange }) => {
  const { gameId, charId } = useParams();
  const allBuilds = useBuild().getBuilds(gameId);
  const [charDialogOpen, setCharDialogOpen] = useState(false);

  const memberData = CHARACTER[gameId][member.id];
  const weaponType = memberData?.type ?? null;

  // Stored build for the current member member (only meaningful for teammates)
  const storedBuild = member.id && member.id !== charId
    ? allBuilds[member.id] ?? null
    : null;
  const isMainCharacter = member.id === charId;
  const showToggle = storedBuild !== null;
  const buildLocked = !isMainCharacter && member.useUserBuild === true;

  const handleToggleUserBuild = (useUserBuild) => {
    if (useUserBuild && storedBuild) {
      onChange(applyStoredBuild(gameId, member, storedBuild));
    } else {
      const { build: _, ...rest } = member;
      onChange({ ...rest, useUserBuild: false });
    }
  };

  return (
    <>
      <Card sx={{ width: 300 }}>
        <CardContent component={Stack} spacing={2}>
          <PickerButton
            imageUrl={`${gameId}/character/${member.id}.webp`}
            name={memberData?.name ?? null}
            onClick={() => setCharDialogOpen(true)}
            onClear={() => onChange({
              ...member,
              id: null,
              rank: null,
              weaponId: null,
              weaponRank: null,
              setCounts: {},
              rotation: [],
              useUserBuild: false,
            })}
          />

          {showToggle && (
            <FormControlLabel
              control={
                <Switch
                  checked={buildLocked}
                  onChange={(e) => handleToggleUserBuild(e.target.checked)}
                />
              }
              label={buildLocked ? 'Using own build' : 'Using trial build'}
            />
          )}

          <ToggleButtonGroup
            value={member.rank ?? ''}
            onChange={(_, value) => value !== null &&
              onChange({ ...member, rank: value })
            }
            disabled={buildLocked || !member.id}
            fullWidth
          >
            {[0, 1, 2, 3, 4, 5, 6].map((rank) => (
              <ToggleButton key={rank} value={rank}>
                {`S${rank}`}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Stack spacing={1}>
            <WeapAutocomplete
              gameId={gameId}
              type={weaponType}
              selected={member.weaponId}
              onChange={(weaponId) => onChange({
                ...member,
                weaponId,
                weaponRank: weaponId && getDefaultWeapRank(gameId, weaponId),
              })}
              label="Weapon"
              disabled={buildLocked || !member.id}
              fullWidth
            />

            <ToggleButtonGroup
              value={member.weaponRank ?? ''}
              onChange={(_, value) => value !== null &&
                onChange({ ...member, weaponRank: value })
              }
              disabled={buildLocked || !member.weaponId}
              fullWidth
            >
              {[1, 2, 3, 4, 5].map((rank) => (
                <ToggleButton key={rank} value={rank}>
                  {`S${rank}`}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <SetAutocomplete
            gameId={gameId}
            setCounts={member.setCounts}
            onChange={(value) => onChange({ ...member, setCounts: value })}
            label="Set Bonuses"
            disabled={buildLocked || !member.id}
          />

          {gameId === WW && (
            <EchoAutocomplete
              sets={Object.keys(member.setCounts)}
              selected={member.mainEcho ?? null}
              onChange={(mainEcho) => onChange({ ...member, mainEcho })}
              label="Main Echo"
              disabled={buildLocked || !member.id}
            />
          )}

          {gameId === WW && CHARACTER[gameId][member.id]?.modes && (
            <Box>
              <Typography variant="subtitle2">
                Resonance Mode
              </Typography>
              <ToggleButtonGroup
                value={member.mode ?? CHARACTER[gameId][member.id].modes[0]}
                onChange={(_, value) => {
                  if (value !== null) {
                    onChange({ ...member, mode: value });
                  }
                }}
                disabled={buildLocked}
              >
                {CHARACTER[gameId][member.id].modes.map((mode) => (
                  <ToggleButton key={mode} value={mode}>
                    {formatStr(mode)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          )}
        </CardContent>
      </Card>

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
          onChange(nextMember);
        }}
      />
    </>
  );
};
