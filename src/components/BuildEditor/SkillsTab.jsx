import { Stack, TextField } from '@mui/material';
import { useData } from '@/hooks';
import { formatStr, inRange } from '@/utils';

const SkillsTab = ({ draft, setDraft }) => {
  const { skillIds, maxSkillLevel } = useData('misc');

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
              if (skillLevel === null || inRange(skillLevel, 1, maxSkillLevel)) {
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
                max: maxSkillLevel,
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
