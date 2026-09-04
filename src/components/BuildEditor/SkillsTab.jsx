import { Stack, TextField } from '@mui/material';
import { useData } from '@/hooks';
import { formatStr, inRange } from '@/utils';

const SkillsTab = ({ draft, setDraft }) => {
  const { skillIds } = useData('misc');

  return (
    <Stack spacing={1}>
      {skillIds.map((skillId, i) => {
        return (
          <TextField
            key={i}
            type="number"
            value={draft?.skillLevels?.[skillId] ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              if (!/^\d*$/.test(value)) return;

              const skillLevel = value === '' ? null : Number(value);
              if (skillLevel === null || inRange(skillLevel, 1, 10)) {
                setDraft((prev) => ({
                  ...prev,
                  skillLevels: {
                    ...prev.skillLevels,
                    [skillId]: skillLevel,
                  },
                }));
              }
            }}
            label={formatStr(skillId)}
            disabled={!draft?.id}
            slotProps={{
              htmlInput: {
                min: 1,
                max: 10,
                step: 1,
              },
            }}
          />
        );
      })}
    </Stack>
  );
};

export default SkillsTab;
