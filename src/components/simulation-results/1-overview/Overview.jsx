import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { Switch } from '@/components/Colored';
import { useAccent } from '@/hooks';
import { formatNum } from '@/utils';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';
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
  if (pct > 100) {
    return { grade: 'S', color: '#FFD700' };
  }

  for (const { floor, letter, color } of GRADE_BANDS) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
}

const TextBox = ({ label, value }) => {
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
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Card>
  );
};

const Overview = ({ results }) => {
  const { userDps, dpsCeiling, benchmarkDps, memberIds, userSnapshots } = results;
  const accent = useAccent();
  const [showHits, setShowHits] = useState(false);
  const [weaponOpen, setWeaponOpen] = useState(false);
  const [setsOpen, setSetsOpen] = useState(false);

  const memberStack = [...memberIds];
  if (userSnapshots.some((snapshot) => snapshot.ownerId === 'other')) {
    memberStack.push('other');
  }

  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color: gradeColor } = getGrade(benchmarkPct);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Overall Rating" />
          <CardContent
            component={Stack}
            divider={<Divider />}
            spacing={2}
            sx={{ flex: 1 }}
          >
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
              spacing={2}
              sx={{ flex: 1 }}
            >
              <TextBox label="Team DPS" value={formatNum(userDps)} />
              <TextBox label="Benchmark" value={formatNum(benchmarkDps)} />
              <TextBox label="Theoretical Max" value={formatNum(dpsCeiling)} />
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{ flex: 1 }}
            >
              <TextBox label="Team DPS" value={formatNum(userDps)} />
              <TextBox label="Benchmark" value={formatNum(benchmarkDps)} />
              <TextBox label="Theoretical Max" value={formatNum(dpsCeiling)} />
            </Stack>
          </CardContent>
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Weapons" />
          <Button onClick={() => setWeaponOpen(true)}>
            Open Weapons
          </Button>
          <WeaponsDialog
            results={results}
            open={weaponOpen}
            onClose={() => setWeaponOpen(false)}
          />
          <Button onClick={() => setSetsOpen(true)}>
            Open Sets
          </Button>
          <SetsDialog
            results={results}
            open={setsOpen}
            onClose={() => setSetsOpen(false)}
          />
        </Card>
      </Stack>

      <Card component={Stack} sx={{ flex: 1 }}>
        <CardHeader
          title="Rotation Timeline"
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
        <Stack direction="row" sx={{ flex: 1 }}>
          {!showHits
            ? <AreaView results={results} />
            : <ScatterView results={results} />
          }
          <DistributionChart results={results} />
        </Stack>
      </Card>
    </Stack>
  );
};

export default Overview;
