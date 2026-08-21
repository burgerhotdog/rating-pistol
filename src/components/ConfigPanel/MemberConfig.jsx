import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { WW } from '@/data';
import { useBuilds, useData } from '@/hooks';
import { initMember, getDefaultWeapRank } from '@/utils';
import {
  WeapAutocomplete,
  SetAutocomplete,
  EchoAutocomplete,
} from '../Autocomplete';
import CharacterSelect from './CharacterSelect';

export const MemberConfig = ({ member, onChange }) => {
  const { gameId } = useParams();
  const builds = useBuilds();
  const [characterSelectOpen, setCharacterSelectOpen] = useState(false);

  const memberData = useData('character')[member.id];
  const weaponType = memberData?.type ?? null;

  const [hovered, setHovered] = useState(false);

  return (
    <Card sx={{ width: 340 }}>
      <CardContent component={Stack} spacing={2}>
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Box sx={{ position: 'relative' }}>
            <Card sx={{ width: 80 }}>
              <CardActionArea onClick={() => setCharacterSelectOpen(true)}>
                <CardMedia
                  image={memberData?.icon}
                  title={memberData?.name ?? null}
                  sx={{ width: 80, height: 80 }}
                />
              </CardActionArea>
            </Card>

            {hovered && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({});
                }}
                sx={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  width: 18,
                  height: 18,
                  '&:hover': {
                    bgcolor: 'error.main',
                    color: '#fff',
                    borderColor: 'error.main',
                  },
                }}
              >
                <CloseIcon sx={{ fontSize: 11 }} />
              </IconButton>
            )}
          </Box>
          <Typography variant="caption">
            {memberData?.name ?? '—'}
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={member.rank ?? ''}
          onChange={(_, value) => value !== null &&
            onChange({ ...member, rank: value })
          }
          disabled={!member.id}
          exclusive
          fullWidth
        >
          {[0, 1, 2, 3, 4, 5, 6].map((rank) => (
            <ToggleButton key={rank} value={rank}>
              {`S${rank}`}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider />

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
            disabled={!member.id}
            fullWidth
          />

          <ToggleButtonGroup
            value={member.weaponRank ?? ''}
            onChange={(_, value) => value !== null &&
              onChange({ ...member, weaponRank: value })
            }
            disabled={!member.weaponId}
            exclusive
            fullWidth
          >
            {[1, 2, 3, 4, 5].map((rank) => (
              <ToggleButton key={rank} value={rank}>
                {`S${rank}`}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Divider />

        <Stack spacing={1}>
          <SetAutocomplete
            gameId={gameId}
            setCounts={member.setCounts}
            onChange={(value) => onChange({ ...member, setCounts: value })}
            label="Set Bonuses"
            disabled={!member.id}
          />

          {gameId === WW && (
            <EchoAutocomplete
              sets={Object.keys(member.setCounts)}
              selected={member.mainEcho ?? null}
              onChange={(mainEcho) => onChange({ ...member, mainEcho })}
              label="Main Echo"
              disabled={!member.id}
            />
          )}
        </Stack>

        <Stack direction="row">
          {gameId === WW && memberData?.modes && (
            <ToggleButtonGroup
              value={member.mode ?? memberData.modes[0]}
              onChange={(_, value) => {
                if (value !== null) {
                  onChange({ ...member, mode: value });
                }
              }}
              exclusive
            >
              {memberData.modes.map((mode) => (
                <ToggleButton key={mode} value={mode}>
                  <img
                    src={`wuthering-waves/mode/${mode}.webp`}
                    alt=""
                    width={20}
                    height={20}
                  />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Stack>
      </CardContent>

      <CharacterSelect
        open={characterSelectOpen}
        onClose={() => setCharacterSelectOpen(false)}
        onSelect={(id) => onChange(initMember(id, gameId, builds))}
      />
    </Card>
  );
};
