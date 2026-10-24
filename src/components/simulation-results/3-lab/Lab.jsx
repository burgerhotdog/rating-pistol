import { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  FormControlLabel,
  Skeleton,
  Stack,
} from '@mui/material';
import { Switch } from '@/components/Colored';
import { useData } from '@/hooks';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';

const Lab = ({ results }) => {
  const langData = useData('lang');
  const [normalize, setNormalize] = useState(true);

  const weaponsReady =
    results.userMember &&
    results.userDps &&
    results.weaponResults;

  const setsReady =
    results.userMember &&
    results.userDps &&
    results.setResults;

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader
            title={`${langData.Weapon} Comparisons`}
            action={
              <FormControlLabel
                label="Normalize"
                control={
                  <Switch
                    color="#your-color"
                    checked={normalize}
                    onChange={(event) => setNormalize(event.target.checked)}
                  />
                }
              />
            }
          />
          {weaponsReady ? (
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2 }}>
              <WeaponsDialog
                userMember={results.userMember}
                userDps={results.userDps}
                weaponResults={results.weaponResults}
                normalize={normalize}
              />
            </Box>
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title={`${langData.Equip} Set Comparisons`} />
          {setsReady ? (
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2 }}>
              <SetsDialog
                userMember={results.userMember}
                userDps={results.userDps}
                setResults={results.setResults}
              />
            </Box>
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>
      </Stack>
    </Stack>
  );
};

export default Lab;
