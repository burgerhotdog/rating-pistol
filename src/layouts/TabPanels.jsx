import { Stack } from '@mui/material';
import {
  Rating,
  ProgressChart,
  Timeline,
  DamageDistribution,
  MainstatDist,
  SubstatDist,
} from '@/components';

export default [
  {
    value: 'overview',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Rating
          userDps={results.userDps}
          benchmarkDps={results.benchmarkDps}
        />
        <ProgressChart
          trialBands={results.trialBands}
          userDps={results.userDps}
          prydwenDps={results.prydwenDps}
        />
      </Stack>
    ),
  },
  {
    value: 'damageProfile',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Timeline
          userSummary={results.userSummary}
          memberIds={results.memberIds}
        />
        <DamageDistribution
          userSummary={results.userSummary}
        />
      </Stack>
    ),
  },
  {
    value: 'buildDetails',
    render: (results) => (
      <Stack spacing={1} sx={{ flex: 1 }}>
        <MainstatDist
          configMap={results.configMap}
          userConfigKey={results.userConfigKey}
        />
        <SubstatDist
          configMap={results.configMap}
          userConfigKey={results.userConfigKey}
          userSubStats={results.userSubStats}
        />
      </Stack>
    ),
  },
];
