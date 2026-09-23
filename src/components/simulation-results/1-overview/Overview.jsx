import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useData } from '@/hooks';
import { formatNum } from '@/utils';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';
import DistributionChart from './DistributionChart';
import TimelineChart from './TimelineChart';

const GRADE_BANDS = [
  { floor: 90, letter: 'A', quality: 4 },
  { floor: 80, letter: 'B', quality: 3 },
  { floor: 70, letter: 'C', quality: 2 },
  { floor: 60, letter: 'D', quality: 1 },
];

function getGradeAndColor(pct, qualityColors) {
  if (pct > 100) {
    return { grade: 'S', color: '#FFD700' };
  }

  for (const { floor, letter, quality } of GRADE_BANDS) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      const color = qualityColors[quality];
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: qualityColors[1] };
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

const OverallRating = ({ userDps, dpsCeiling, benchmarkDps }) => {
  const { qualityColors } = useTheme();
  const benchmarkPct = userDps / benchmarkDps * 100;
  const { grade, color } = getGradeAndColor(benchmarkPct, qualityColors);

  return (
    <CardContent
      component={Stack}
      divider={<Divider />}
      spacing={2}
      sx={{ flex: 1 }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
        <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
          {grade}
        </Typography>
        <Typography variant="body1" sx={{ color, opacity: 0.7 }}>
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
    </CardContent>
  );
};

const Overview = ({ results }) => {
  const langData = useData('lang');
  const [weaponOpen, setWeaponOpen] = useState(false);
  const [setsOpen, setSetsOpen] = useState(false);

  const overallReady =
    results.userDps &&
    results.benchmarkDps &&
    results.dpsCeiling;

  const weaponsReady =
    results.userMember &&
    results.userDps &&
    results.weaponResults;

  const handleWeaponClose = useCallback(() => {
    setWeaponOpen(false);
  }, []);

  const setsReady =
    results.userMember &&
    results.userDps &&
    results.setResults;

  const handleSetsClose = useCallback(() => {
    setSetsOpen(false);
  }, []);

  const timelineReady = 
    results.memberIds &&
    results.userSnapshots &&
    results.userRotationTime &&
    results.userRotationTimeSource;

  const distributionReady =
    results.userSnapshots &&
    results.userMember;

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 2 }}>
          <CardHeader title="Overall Rating" />
          {overallReady ? (
            <OverallRating
              userDps={results.userDps}
              benchmarkDps={results.benchmarkDps}
              dpsCeiling={results.dpsCeiling}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>

        <Stack spacing={1} sx={{ flex: 1 }}>
          <Card component={Stack} sx={{ flex: 1 }}>
            <CardHeader title={`${langData.Weapon}s`}/>
            {weaponsReady ? (
              <>
                <Button onClick={() => setWeaponOpen(true)}>
                  Open
                </Button>
                <WeaponsDialog
                  userMember={results.userMember}
                  userDps={results.userDps}
                  weaponResults={results.weaponResults}
                  open={weaponOpen}
                  onClose={handleWeaponClose}
                />
              </>
            ) : (
              <Skeleton variant="rectangular" sx={{ flex: 1 }} />
            )}
          </Card>

          <Card component={Stack} sx={{ flex: 1 }}>
            <CardHeader title={`${langData.Equip} Set Bonuses`} />
            {setsReady ? (
              <>
                <Button onClick={() => setSetsOpen(true)}>
                  Open
                </Button>
                <SetsDialog
                  userMember={results.userMember}
                  userDps={results.userDps}
                  setResults={results.setResults}
                  open={setsOpen}
                  onClose={handleSetsClose}
                />
              </>
            ) : (
              <Skeleton variant="rectangular" sx={{ flex: 1 }} />
            )}
          </Card>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 2 }}>
          <CardHeader title="Rotation Timeline" />
          {timelineReady && (
            <TimelineChart
              memberIds={results.memberIds}
              userSnapshots={results.userSnapshots}
              userRotationTime={results.userRotationTime}
              userRotationTimeSource={results.userRotationTimeSource}
            />
          )}
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Damage Distribution" />
          {distributionReady && (
            <DistributionChart
              userSnapshots={results.userSnapshots}
              userMember={results.userMember}
            />
          )}
        </Card>
      </Stack>
    </Stack>
  );
};

export default Overview;
