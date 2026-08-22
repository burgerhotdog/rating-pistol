import { useState } from 'react';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import { useData } from '@/hooks';
import TeamSetupDialog from './TeamSetupDialog';

const TeamSetup = ({ team, setTeam }) => {
  const [open, setOpen] = useState(false);
  const charData = useData('character');

  return (
    <Stack>
      <Typography variant="subtitle2" color="textSecondary">
        Team Setup
      </Typography>

      <IconButton
        onClick={() => setOpen(true)}
        sx={{ justifyContent: 'center', p: 1, borderRadius: 1 }}
      >
        <Stack direction="row" spacing={1}>
          {team.map((member, idx) => {
            const { icon, name } = charData[member.id] ?? {};
            return <Avatar key={idx} variant="rounded" src={icon} alt={name} />;
          })}
        </Stack>
      </IconButton>

      <TeamSetupDialog
        open={open}
        onClose={() => setOpen(false)}
        team={team}
        setTeam={setTeam}
      />
    </Stack>
  );
};

export default TeamSetup;
