import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { WW } from '@/data';
import { useData } from '@/hooks';
import { formatStr, getDefaultWeapRank } from '@/utils';
import { WeapAutocomplete, SetAutocomplete, EchoAutocomplete } from './Autocomplete';
import CharacterPicker from './CharacterPicker';
import RotationEditor from './RotationEditor';

const MemberCard = ({ member, onChange }) => {
  const { gameId } = useParams();

  const memberData = useData('character')[member.id];
  const weaponType = memberData?.type ?? null;

  return (
    <Card sx={{ width: 340 }}>
      <CardContent component={Stack} spacing={2}>
        <CharacterPicker member={member} onChange={onChange} />

        <ToggleButtonGroup
          value={member.rank ?? ''}
          onChange={(_, rank) => rank !== null && onChange({ ...member, rank })}
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
            onChange={(_, weaponRank) => weaponRank !== null && onChange({ ...member, weaponRank })}
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

        <Stack direction="row" spacing={1}>
          {member.id && (
            <RotationEditor member={member} />
          )}

          {gameId === WW && memberData?.modes && (
            <ToggleButtonGroup
              value={member.mode ?? memberData.modes[0]}
              onChange={(_, mode) => mode !== null && onChange({ ...member, mode })}
              exclusive
            >
              {memberData.modes.map((mode) => (
                <ToggleButton key={mode} value={mode} title={formatStr(mode)}>
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
    </Card>
  );
};

export default MemberCard;
