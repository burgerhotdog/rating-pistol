import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  Skeleton,
  Stack,
} from '@mui/material';
import { useData } from '@/hooks';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';

const Lab = ({ results }) => {
  const langData = useData('lang');
  const [weaponOpen, setWeaponOpen] = useState(false);
  const [setsOpen, setSetsOpen] = useState(false);

  const handleWeaponClose = useCallback(() => setWeaponOpen(false), []);
  const handleSetsClose = useCallback(() => setSetsOpen(false), []);

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
          <CardHeader title={`${langData.Weapon} Comparisons`}/>
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
          <CardHeader title={`${langData.Equip} Set Comparisons`} />
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
  );
};

export default Lab;
