import { useState } from 'react';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import { useData } from '@/hooks';
import TeamSetupDialog from './TeamSetupDialog';

const TeamSetup = ({ team, setTeam }) => {
  const [open, setOpen] = useState(false);
  const charData = useData('character');

  const renderAvatar = ({ id }, index) => (
    <Avatar
      key={index}
      src={charData[id]?.icon}
      alt={charData[id]?.name}
    />
  );

  return (
    <Stack>
      <Typography variant="subtitle2">
        Team Setup
      </Typography>

      <IconButton
        onClick={() => setOpen(true)}
        sx={{ justifyContent: 'center', p: 1, borderRadius: 1 }}
      >
        <Stack direction="row" spacing={1}>
          {team.map(renderAvatar)}
        </Stack>
      </IconButton>

      <TeamSetupDialog
        team={team}
        setTeam={setTeam}
        open={open}
        onClose={() => setOpen(false)}
      />
    </Stack>
  );
};

export default TeamSetup;
