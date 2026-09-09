import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { formatDate, formatDays } from '@/utils';
import Header from './Header';
import MenuAttrs from './MenuAttrs';
import TeamSetup from './TeamSetup';

function getDaysAgo(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Unknown';

  const now = new Date();
  const diffMs = now - date;
  return diffMs / (1000 * 60 * 60 * 24);
}

const ConfigPanel = ({ team, setTeam }) => {
  const { charId } = useParams();

  const member = team.find((member) => member.id === Number(charId));

  const dateString = member.build?.lastUpdated;
  const daysAgo = getDaysAgo(dateString);
  const daysAgoStr = Math.floor(daysAgo) === 0
    ? 'Today'
    : `${formatDays(daysAgo)} ago`;

  return (
    <Card component={Stack} sx={{ width: 320 }}>
      <Header />
      <CardContent
        component={Stack}
        divider={<Divider />}
        spacing={1}
        sx={{ flex: 1 }}
      >
        <MenuAttrs team={team} member={member}/>
        <TeamSetup team={team} setTeam={setTeam} />
        <Tooltip title={formatDate(dateString)}>
          <Typography variant="caption" color="textSecondary">
            Last updated: {daysAgoStr}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default ConfigPanel;
