import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
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
import { CHARACTER } from '@/data';
import { useData } from '@/hooks';
import { formatStr, formatTime, formatDate } from '@/utils';
import { TeamConfig } from './TeamConfig';
import { MenuAttrs } from './MenuAttrs';

export const StatsPanel = ({ team = [], setTeam }) => {
  const { gameId, charId } = useParams();
  const characters = useData('character');
  const elements = useData('element');
  const types = useData('type');

  const [teamConfigOpen, setTeamConfigOpen] = useState(false);

  const member = team.find((member) => member.id === charId);

  const { name, icon, type, element } = characters[charId];

  return (
    <Card component={Stack} sx={{ width: 300 }}>
      <CardHeader
        avatar={<Avatar variant="rounded" src={icon} alt={name} />}
        title={name}
        subheader={
          <Stack direction="row" spacing={0.5}>
            <Chip
              variant="outlined"
              avatar={<Avatar src={elements[element].icon} />}
              label={formatStr(element)}
              sx={{ fontWeight: 'bold', color: elements[element].color }}
            />
            <Chip
              variant="outlined"
              avatar={<Avatar src={types[type].icon} />}
              label={formatStr(type)}
              sx={{ fontWeight: 'bold' }}
            />
          </Stack>
        }
      />

      <CardContent
        component={Stack}
        divider={<Divider />}
        spacing={1}
        sx={{ flex: 1 }}
      >
        <MenuAttrs team={team} />

        <Stack>
          <Typography variant="subtitle2" color="textSecondary">
            Team Configuration
          </Typography>

          <IconButton
            onClick={() => setTeamConfigOpen(true)}
            sx={{ justifyContent: 'center', p: 1, borderRadius: 1 }}
          >
            <Stack direction="row" spacing={1}>
              {team.map((member, index) => (
                <Box key={index}>
                  <Avatar
                    variant="rounded"
                    src={CHARACTER[gameId][member?.id]?.icon}
                    alt={CHARACTER[gameId][member?.id]?.name}
                  />
                </Box>
              ))}
            </Stack>
          </IconButton>

          <TeamConfig
            open={teamConfigOpen}
            onClose={() => setTeamConfigOpen(false)}
            team={team}
            setTeam={setTeam}
          />
        </Stack>

        <Tooltip title={formatDate(member.build?.lastUpdated)}>
          <Typography variant="caption" color="textSecondary">
            Last updated {formatTime(member.build?.lastUpdated)}
          </Typography>
        </Tooltip>
      </CardContent>
    </Card>
  );
};
