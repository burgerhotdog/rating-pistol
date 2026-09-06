import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { useAccent } from '@/hooks';
import { formatNum } from '@/utils';
import { Switch } from '../../Colored';
import DistributionChart from './DistributionChart';
import AreaView from './RotationTimeline/AreaView';
import ScatterView from './RotationTimeline/ScatterView';

const GRADE_BANDS = [
  { floor: 90, letter: 'A', color: '#4ade80' },
  { floor: 80, letter: 'B', color: '#86efac' },
  { floor: 70, letter: 'C', color: '#fbbf24' },
  { floor: 60, letter: 'D', color: '#f97316' },
];

function getGrade(pct) {
  if (pct > 100) return { grade: 'S', color: '#FFD700' };

  for (const { floor, letter, color } of GRADE_BANDS) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
}

const Stat = ({ label, value, valueColor }) => {
  return (
    <Card
      component={Stack}
      elevation={6}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        p: 1,
        flex: 1,
      }}
    >
      <Typography variant="overline" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: valueColor }}>
        {value}
      </Typography>
    </Card>
  );
};

const OverviewTab = ({ results }) => {
  const { userDps, dpsCeiling, benchmarkDps, memberIds, userSnapshots } = results;
  const accent = useAccent();
  const [showHits, setShowHits] = useState(false);

  const memberStack = [...memberIds];
  if (userSnapshots.some((snapshot) => snapshot.ownerId === 'other')) {
    memberStack.push('other');
  }

  const totalDamage = userSnapshots.reduce((acc, { damage = 0 }) => acc + damage, 0);
  const duration = userSnapshots.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);

  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color: gradeColor } = getGrade(benchmarkPct);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Overall Rating" />
          <CardContent component={Stack} divider={<Divider />} spacing={2} sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
              <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
                {grade}
              </Typography>
              <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
                ({benchmarkPct.toFixed()}%)
              </Typography>
              <Typography variant="caption" color="textSecondary">
                of benchmark
              </Typography>
            </Stack>

            <Stack
              direction="row"
              divider={<Divider orientation="vertical" />}
              spacing={2}
              sx={{ flex: 1 }}
            >
              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                <Stat label="Team DPS" value={formatNum(userDps)} />
                <Stat label="Benchmark" value={formatNum(benchmarkDps)} />
                <Stat label="Theoretical Max" value={formatNum(dpsCeiling)} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Damage Distribution" />
          <DistributionChart results={results} />
        </Card>
      </Stack>

      <Card component={Stack} sx={{ flex: 1 }}>
        <CardHeader
          title="Rotation Timeline"
          subheader={`${(duration / 1000).toFixed(1)}s rotation · ${formatNum(totalDamage)} dmg · ${formatNum(userDps)} DPS`}
          action={
            <FormControlLabel
              control={
                <Switch
                  color={accent}
                  checked={showHits}
                  onChange={(e) => setShowHits(e.target.checked)}
                />
              }
              label="Show Damage Ticks"
            />
          }
        />
        {!showHits
          ? <AreaView results={results} />
          : <ScatterView results={results} />
        }
      </Card>
    </Stack>
  );
};

export default OverviewTab;
