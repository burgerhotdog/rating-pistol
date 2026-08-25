import { useMemo } from 'react';
import { Stack, TextField } from '@mui/material';
import { useData } from '@/hooks';
import { inRange } from '@/utils';
import { Autocomplete } from '../Autocomplete';

const CharacterTab = ({ draft, setDraft, edit }) => {
  const characters = useData('character');
  const miscData = useData('misc');

  const options = useMemo(
    () => Object.values(characters)
      .sort((a, b) =>
        b.version - a.version ||
        Number(b.id) - Number(a.id)
      ),
    [characters],
  );

  return (
    <Stack direction="row" spacing={1}>
      <Autocomplete
        options={options}
        valueId={draft?.id}
        onChange={(id) => setDraft((prev) => ({ ...prev, id }))}
        disabled={edit}
        sx={{ flex: 1 }}
      />

      <TextField
        type="number"
        value={draft?.level ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (!/^\d*$/.test(value)) return;

          const level = value === '' ? null : Number(value);
          if (level === null || inRange(level, 1, miscData.maxLevel)) {
            setDraft((prev) => ({ ...prev, level }));
          }
        }}
        label="Level"
        disabled={!draft?.id}
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
        value={draft?.rank ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (!/^\d*$/.test(value)) return;

          const rank = value === '' ? null : Number(value);
          if (rank === null || inRange(rank, 0, 6)) {
            setDraft((prev) => ({ ...prev, rank }));
          }
        }}
        label="Rank"
        disabled={!draft?.id}
        slotProps={{
          htmlInput: {
            min: 0,
            max: 6,
            step: 1,
          },
        }}
      />
    </Stack>
  );
};

export default CharacterTab;
