import { Card, CardHeader, Stack } from '@mui/material';
import SummaryCard from './SummaryCard';
import DistributionChart from './DistributionChart';
import TimelineChart from './TimelineChart';

const Overview = ({ results }) => {
  const timelineReady =
    results.memberIds &&
    results.userSnapshots &&
    results.userRotationTime;

  const distributionReady =
    results.userSnapshots;

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 2 }}>
          <CardHeader title="Overall Rating" />
          <SummaryCard
            userDps={results.userDps}
            benchmarkDps={results.benchmarkDps}
            dpsCeiling={results.dpsCeiling}
          />
        </Card>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 2 }}>
          <CardHeader title="Rotation Timeline" />
          {timelineReady && (
            <TimelineChart
              memberIds={results.memberIds}
              userSnapshots={results.userSnapshots}
              userRotationTime={results.userRotationTime}
            />
          )}
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Damage Distribution" />
          {distributionReady && (
            <DistributionChart
              snapshots={results.userSnapshots}
            />
          )}
        </Card>
      </Stack>
    </Stack>
  );
};

export default Overview;
