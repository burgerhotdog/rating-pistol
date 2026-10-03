import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Skeleton,
  Stack,
} from '@mui/material';
import { useData } from '@/hooks';
import { formatNum } from '@/utils';
import SummaryCard from './SummaryCard';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';
import DistributionChart from './DistributionChart';
import TimelineChart from './TimelineChart';

const Overview = ({ results }) => {
  const langData = useData('lang');
  const [weaponOpen, setWeaponOpen] = useState(false);
  const [setsOpen, setSetsOpen] = useState(false);

  const handleWeaponClose = useCallback(() => setWeaponOpen(false), []);
  const handleSetsClose = useCallback(() => setSetsOpen(false), []);

  const overallReady =
    results.userDps &&
    results.benchmarkDps &&
    results.dpsCeiling;

  const weaponsReady =
    results.userMember &&
    results.userDps &&
    results.weaponResults;

  const setsReady =
    results.userMember &&
    results.userDps &&
    results.setResults;

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
            <SummaryCard
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
          <CardHeader title="Rotation Timeline" subheader={`DPS: ${formatNum(results.userDps ?? 0)}`} />
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
