import { useMemo } from 'react';
import { Stack, TextField } from '@mui/material';
import { useData } from '@/hooks';
import { inRange } from '@/utils';
import { Autocomplete } from '../Autocomplete';

const WeaponTab = ({ draft, setDraft }) => {
  const weapons = useData('weapon');
  const miscData = useData('misc');

  const typeLock = useData('character')[draft?.id]?.type;
  const options = useMemo(
    () => Object.values(weapons)
      .filter((weapon) =>
        !typeLock ||
        weapon.type === typeLock
      )
      .sort((a, b) =>
        b.quality - a.quality ||
        b.version - a.version ||
        Number(b.id) - Number(a.id)
      ),
    [weapons, typeLock],
  );

  return (
    <Stack direction="row" spacing={1}>
      <Autocomplete
        options={options}
        groupBy={(weapon) => weapon.quality}
        valueId={draft?.weaponId}
        onChange={(weaponId) => setDraft((prev) => ({ ...prev, weaponId }))}
        disabled={!draft?.id}
        sx={{ flex: 1 }}
      />

      <TextField
        type="number"
        value={draft?.weaponLevel ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (!/^\d*$/.test(value)) return;

          const weaponLevel = value === '' ? null : Number(value);
          if (weaponLevel === null || inRange(weaponLevel, 1, miscData.maxLevel)) {
            setDraft((prev) => ({ ...prev, weaponLevel }));
          }
        }}
        label="Level"
        disabled={!draft?.weaponId}
        slotProps={{
          htmlInput: {
            min: 1,
            max: miscData.maxLevel,
            step: 1,
          },
        }}
      />

      <TextField
        type="number"
        value={draft?.weaponRank ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (!/^\d*$/.test(value)) return;

          const weaponRank = value === '' ? null : Number(value);
          if (weaponRank === null || inRange(weaponRank, 1, 5)) {
            setDraft((prev) => ({ ...prev, weaponRank }));
          }
        }}
        label="Rank"
        disabled={!draft?.weaponId}
        slotProps={{
          htmlInput: {
            min: 1,
            max: 5,
            step: 1,
          },
        }}
      />
    </Stack>
  );
};

export default WeaponTab;
