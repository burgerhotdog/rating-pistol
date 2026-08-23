import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { formatDate, formatTime } from '@/utils';
import Header from './Header';
import MenuAttrs from './MenuAttrs';
import TeamSetup from './TeamSetup';

const ConfigPanel = ({ team, setTeam }) => {
  const { charId } = useParams();
  const member = team.find((member) => member.id === charId);

  return (
    <Card component={Stack} sx={{ width: 350 }}>
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
