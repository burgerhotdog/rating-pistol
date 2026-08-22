import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useData } from '@/hooks';
import { formatDate, formatStr, formatTime } from '@/utils';
import MenuAttrs from './MenuAttrs';
import TeamSetupDialog from './TeamSetupDialog';

const Header = () => {
  const { charId } = useParams();
  const characters = useData('character');
  const { name, icon, type, element } = characters[charId];

  const { icon: elementIcon, color } = useData('element')[element];
  const { icon: typeIcon } = useData('type')[type];

  return (
    <CardHeader
      avatar={<Avatar variant="rounded" src={icon} alt={name} />}
      title={name}
      subheader={(
        <Stack direction="row" spacing={0.5}>
          <Chip
            variant="outlined"
            avatar={<Avatar src={elementIcon} />}
            label={formatStr(element)}
            sx={{ fontWeight: 'bold', color }}
          />
          <Chip
            variant="outlined"
            avatar={<Avatar src={typeIcon} />}
            label={formatStr(type)}
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
      )}
    />
  );
};

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

const ConfigPanel = ({ team, setTeam }) => {
  const { charId } = useParams();
  const member = team.find((member) => member.id === charId);

  return (
    <Card component={Stack} sx={{ width: 300 }}>
      <Header />
      <CardContent
        component={Stack}
        divider={<Divider />}
        spacing={1}
        sx={{ flex: 1 }}
      >
        <MenuAttrs team={team} member={member}/>
        <TeamSetup team={team} setTeam={setTeam} />
        <Tooltip title={formatDate(member.build?.lastUpdated)}>
          <Typography variant="caption" color="textSecondary">
            Last updated {formatTime(member.build?.lastUpdated)}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
