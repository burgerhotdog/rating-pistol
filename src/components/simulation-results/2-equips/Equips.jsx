import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useAccent } from '@/hooks';
import { formatNum, formatStr } from '@/utils';
import Mainstats from './Mainstats';
import SubstatsChart from './SubstatsChart';
import TrajectoryChart from './TrajectoryChart';

const ExtraSubstat = ({ userDps, extraSubstats }) => {
  const extraSubstatsList = Object.entries(extraSubstats)
    .map(([stat, mps]) => ({ stat, diff: mps / userDps - 1 }))
    .filter(({ diff }) => diff >= 0.0005)
    .toSorted((a, b) => b.diff - a.diff);

  return (
    <>
      {extraSubstatsList.map(({ stat, diff }, i) => {
        return (
          <Stack key={i} direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant="body2"
              sx={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {formatStr(stat)}:
            </Typography>
            <Typography variant="body2">
              +{(diff * 100).toFixed(1)}%
            </Typography>
          </Stack>
        );
      })}
    </>
  );
};

const Equips = ({ results }) => {
  const accent = useAccent();

  const mainstatsReady =
    results.equipListConfigs &&
    results.userMember?.equipList;

  const substatsReady = 
    results.equipListConfigs &&
    results.userMember?.equipList;

  const extraSubstatsReady =
    results.userDps &&
    results.extraSubstats;

  const trajectoryReady =
    results.dpsProgression &&
    results.userDps &&
    results.dpsCeiling &&
    results.fit &&
    results.benchmarkDay != null;

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Mainstat Distribution" />
          {mainstatsReady ? (
            <CardContent component={Stack} sx={{ flex: 1, overflow: 'hidden' }}>
              <Mainstats
                equipListConfigs={results.equipListConfigs}
                equipList={results.userMember.equipList}
              />
            </CardContent>
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>

        <Card component={Stack} sx={{ flex: 2 }}>
          <CardHeader title="Substat Distribution" />
          {substatsReady ? (
            <SubstatsChart
              equipListConfigs={results.equipListConfigs}
              equipList={results.userMember.equipList}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>

        <Card component={Stack} sx={{ flex: 0.75 }}>
          <CardHeader
            title="Diff w/ extra substat"
            subheader={`Control: ${formatNum(results.extraSubstatsControl ?? 0)}`}
          />
          {extraSubstatsReady ? (
            <CardContent component={Stack} sx={{ flex: 1, overflow: 'hidden' }}>
              <ExtraSubstat
                userDps={results.userDps}
                extraSubstats={results.extraSubstats}
              />
            </CardContent>
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Estimated Farming Trajectory" />
          {trajectoryReady ? (
            <TrajectoryChart
              dpsProgression={results.dpsProgression}
              userDps={results.userDps}
              dpsCeiling={results.dpsCeiling}
              fit={results.fit}
              benchmarkDay={results.benchmarkDay}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
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
