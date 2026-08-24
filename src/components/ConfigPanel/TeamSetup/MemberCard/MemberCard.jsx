import { useParams } from 'react-router-dom';
import { Card, CardContent, Divider, Stack } from '@mui/material';
import { WW } from '@/data';
import { useData } from '@/hooks';
import CharacterPicker from './CharacterPicker';
import Rank from './Rank';
import WeaponId from './WeaponId';
import WeaponRank from './WeaponRank';
import SetCounts from './SetCounts';
import MainEcho from './MainEcho';
import Mode from './Mode';
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
          <Rank
            memberId={member.id}
            memberRank={member.rank}
            onChange={(rank) => setMember({ ...member, rank })}
          />
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
          <SetCounts
            memberId={member.id}
            setCounts={member.setCounts}
            onChange={(setCounts) => setMember({ ...member, setCounts })}
          />
          {gameId === WW && (
            <MainEcho
              memberId={member.id}
              setCounts={member.setCounts}
              mainEcho={member.mainEcho}
              onChange={(mainEcho) => setMember({ ...member, mainEcho })}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          {member.id && (
            <RotationEditor
              member={member}
              onChange={(rotation) => setMember({ ...member, rotation })}
            />
          )}
          {gameId === WW && 'modes' in memberData && (
            <Mode
              member={member}
              onChange={(mode) => setMember({ ...member, mode })}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MemberCard;
