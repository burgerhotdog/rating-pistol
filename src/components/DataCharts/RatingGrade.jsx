import {
  Box,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { FlexCard } from '@/components';
import { formatNum } from '@/utils';

const InfoLabel = ({ label, tip }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    }}
  >
    <Typography
      variant="overline"
      color="textSecondary"
      sx={{ lineHeight: 1.4 }}
    >
      {label}
    </Typography>

    <Tooltip
      title={tip}
    >
      <HelpOutlineOutlinedIcon
        color="disabled"
      />
    </Tooltip>
  </Box>
);

const getGrade = (pct) => {
  if (pct > 100) return { grade: 'S', color: '#FFD700' };

  const bands = [
    { floor: 90, letter: 'A', color: '#4ade80' },
    { floor: 80, letter: 'B', color: '#86efac' },
    { floor: 70, letter: 'C', color: '#fbbf24' },
    { floor: 60, letter: 'D', color: '#f97316' },
  ];

  for (const { floor, letter, color } of bands) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
};

export const RatingGrade = ({ benchmarkDps, userDps }) => {
  const scaledBuildRating = userDps / benchmarkDps * 100;

  const { grade, color: gradeColor } = getGrade(scaledBuildRating);

  return (
    <FlexCard direction="row">
      <Stack
        spacing={1.5}
        sx={{ flex: 1, p: 2, minWidth: 150, justifyContent: 'center' }}
      >
        <Box>
          <InfoLabel
            label="Rating"
            tip="Your team's total damage as a percentage of the team benchmark. Reflects how your character's current build contributes relative to the team's expected optimum."
          />

          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
              {grade}
            </Typography>

            <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
              ({scaledBuildRating.toFixed()}%)
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box>
          <InfoLabel
            label="Team DPS"
            tip="The team's total damage for one rotation divided by the time it takes to execute."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(userDps)}
          </Typography>
        </Box>

        <Box>
          <InfoLabel
            label="Benchmark"
            tip="Sum of each character's simulated average damage at the benchmark week."
          />

          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {formatNum(benchmarkDps)}
          </Typography>
        </Box>
      </Stack>
    </FlexCard>
  );
};
