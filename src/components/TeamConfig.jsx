import { Card, CardContent, Stack } from '@mui/material';
import { CharacterPicker } from '@/components/CharacterPicker';

export const TeamConfig = ({ gameId, team, updateTeam }) => {

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Stack direction="row" spacing={2}>
          {team.map((member, index) => {
            return (
              <CharacterPicker
                key={index}
                gameId={gameId}
                currentId={member}
                updateTeam={newId => updateTeam(index, newId)}
              />
            );
          })}
        </Stack>

      </CardContent>
    </Card>
  );
};
