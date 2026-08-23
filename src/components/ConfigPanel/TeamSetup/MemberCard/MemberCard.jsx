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
import { formatStr } from '@/utils';
import CharacterPicker from './CharacterPicker';
import WeaponId from './WeaponId';
import WeaponRank from './WeaponRank';
import SetCountsAutocomplete from './SetCountsAutocomplete';
import MainEchoAutocomplete from './MainEchoAutocomplete';
import RotationEditor from './RotationEditor';

const MemberCard = ({ member, setMember }) => {
  const { gameId } = useParams();

  const memberData = useData('character')[member.id];

  return (
    <Card sx={{ width: 340 }}>
      <CardContent component={Stack} divider={<Divider />} spacing={2}>
        <Stack spacing={1}>
          <CharacterPicker
            member={member}
            setMember={setMember}
          />

          <ToggleButtonGroup
            value={member.rank ?? ''}
            onChange={(_, rank) => rank !== null && setMember({ ...member, rank })}
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
        </Stack>

        <Stack spacing={1}>
          <WeaponId
            memberId={member.id}
            weaponId={member.weaponId}
            member={member}
            setMember={setMember}
          />
          <WeaponRank
            weaponId={member.weaponId}
            weaponRank={member.weaponRank}
            onChange={(weaponRank) => setMember({ ...member, weaponRank })}
          />
        </Stack>

        <Stack spacing={1}>
          <SetCountsAutocomplete
            memberId={member.id}
            setCounts={member.setCounts}
            onChange={(setCounts) => setMember({ ...member, setCounts })}
          />

          {gameId === WW && (
            <MainEchoAutocomplete
              memberId={member.id}
              setCounts={member.setCounts}
              mainEcho={member.mainEcho}
              onChange={(mainEcho) => setMember({ ...member, mainEcho })}
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
              onChange={(_, mode) => mode !== null && setMember({ ...member, mode })}
              exclusive
            >
              {memberData.modes.map((mode) => (
                <ToggleButton key={mode} value={mode} title={formatStr(mode)}>
                  <img
                    src={`wuthering-waves/mode/${mode}.webp`}
                    alt=""
                    style={{ width: 14, height: 14 }}
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
