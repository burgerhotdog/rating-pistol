import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { useAccent } from '@/hooks';
import { Switch } from '../../Colored';
import Mainstats from './Mainstats';
import SubstatsChart from './SubstatsChart';
import TrajectoryChart from './TrajectoryChart';

const EquipsTab = ({ results }) => {
  const accent = useAccent();
  const [substatsAll, setSubstatsAll] = useState(false);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Mainstat Distribution" />
          <CardContent component={Stack} sx={{ flex: 1, overflow: 'hidden' }}>
            <Mainstats results={results} />
          </CardContent>
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader
            title="Substat Distribution"
            action={
              <FormControlLabel
                control={
                  <Switch
                    color={accent}
                    checked={substatsAll}
                    onChange={(e) => setSubstatsAll(e.target.checked)}
                  />
                }
                label="Show all"
              />
            }
          />
          <SubstatsChart
            results={results}
            substatsAll={substatsAll}
          />
        </Card>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title="Estimated Farming Trajectory" />
          <TrajectoryChart results={results} />
        </Card>
      </Stack>

      <svg width="0" height="0">
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

export default EquipsTab;
