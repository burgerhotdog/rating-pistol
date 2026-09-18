import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import { useAccent } from '@/hooks';
import { getMainstatConfigKey, sumSubstatRolls, formatStr } from '@/utils';
import Mainstats from './Mainstats';
import SubstatsChart from './SubstatsChart';
import TrajectoryChart from './TrajectoryChart';

const Equips = ({ results }) => {
  const { gameId } = useParams();
  const accent = useAccent();

  const userMainstatConfigKey = getMainstatConfigKey(gameId, results.userMember.equipList);
  const userSubstatRolls = sumSubstatRolls(gameId, results.userMember.equipList);

  const extraSubstatsList = Object.entries(results.extraSubstats)
    .map(([stat, mps]) => ({ stat, diff: mps / results.userDps - 1 }))
    .filter(({ diff }) => diff >= 0.0005)
    .toSorted((a, b) => b.diff - a.diff);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Mainstat Distribution" />
          <CardContent component={Stack} sx={{ flex: 1, overflow: 'hidden' }}>
            <Mainstats
              results={results}
              userMainstatConfigKey={userMainstatConfigKey}
            />
          </CardContent>
        </Card>

        <Card component={Stack} sx={{ flex: 2 }}>
          <CardHeader
            title="Substat Distribution"
          />
          <SubstatsChart
            results={results}
            userMainstatConfigKey={userMainstatConfigKey}
            userSubstatRolls={userSubstatRolls}
          />
        </Card>

        <Card component={Stack} sx={{ flex: 0.75 }}>
          <CardHeader title="Diff w/ extra substat" />
          <CardContent component={Stack} sx={{ flex: 1, overflow: 'hidden' }}>
            {extraSubstatsList.map(({ stat, diff }, i) => {
              return (
                <Stack key={i} direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography>
                    {formatStr(stat)}:
                  </Typography>
                  <Typography>
                    +{(diff * 100).toFixed(1)}%
                  </Typography>
                </Stack>
              );
            })}
          </CardContent>
        </Card>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Estimated Farming Trajectory" />
          <TrajectoryChart results={results} />
        </Card>
      </Stack>

      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.9} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>
    </Stack>
  );
};

export default Equips;
