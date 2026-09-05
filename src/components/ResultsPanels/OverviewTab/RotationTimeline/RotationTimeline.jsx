import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { useAccent } from '@/hooks';
import { formatNum } from '@/utils';
import { Switch } from '../../../Colored';
import AreaView from './AreaView';
import ScatterView from './ScatterView';

const RotationTimeline = ({ results }) => {
  const { userDps, userSnapshots, memberIds } = results;
  const accent = useAccent();
  const [showHits, setShowHits] = useState(false);

  const memberStack = [...memberIds];
  if (userSnapshots.some((snapshot) => snapshot.ownerId === 'other')) {
    memberStack.push('other');
  }

  const totalDamage = userSnapshots.reduce((acc, { damage = 0 }) => acc + damage, 0);
  const duration = userSnapshots.reduce((max, { runtime = 0 }) => Math.max(max, runtime), 0);

  return (
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

      <CardContent component={Stack} sx={{ flex: 1 }}>
        {!showHits
          ? <AreaView results={results} />
          : <ScatterView results={results} />
        }
      </CardContent>
    </Card>
  );
};

export default RotationTimeline;
