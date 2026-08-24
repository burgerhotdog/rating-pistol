import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { clamp, formatNum } from '@/utils';

const GRADE_BANDS = [
  { floor: 90, letter: 'A', color: '#4ade80' },
  { floor: 80, letter: 'B', color: '#86efac' },
  { floor: 70, letter: 'C', color: '#fbbf24' },
  { floor: 60, letter: 'D', color: '#f97316' },
];

function getGrade(pct) {
  if (pct > 100) return { grade: 'S', color: '#FFD700' };

  for (const { floor, letter, color } of GRADE_BANDS) {
    if (pct >= floor) {
      const pos = pct - floor;
      const suffix = pos >= 7 ? '+' : pos < 3 ? '-' : '';
      return { grade: letter + suffix, color };
    }
  }

  return { grade: 'E', color: '#ef4444' };
}

// Inverts the fitted power-law decay (remaining = A * week^-q) to find the farming week equivalent to userDps
function estimateEquivalentWeek(userDps, dpsCeiling, fit) {
  if (!fit || !dpsCeiling) return null;
  const remaining = dpsCeiling - userDps;
  if (remaining <= 0) return Infinity;
  return (fit.A / remaining) ** (1 / fit.q);
}

const THRESHOLD_ORDER = [0.5, 0.75, 0.9, 0.95, 0.99];

function getMilestones(thresholdWeeks) {
  if (!thresholdWeeks) return [];
  return THRESHOLD_ORDER
    .map((threshold) => ({ threshold, ...thresholdWeeks[threshold] }))
    .filter((entry) => entry.week != null);
}

function getEfficiencyLabel(q) {
  if (q == null) return null;
  if (q >= 1.5) return { label: 'Fast', color: 'success.main' };
  if (q >= 0.8) return { label: 'Moderate', color: 'warning.main' };
  return { label: 'Slow', color: 'error.main' };
}

function getConfidenceLabel(bands) {
  if (!bands?.mean) return null;
  const spread = (bands.p90 - bands.p10) / bands.mean;
  if (spread < 0.1) return { label: 'High', color: 'success.main' };
  if (spread < 0.25) return { label: 'Medium', color: 'warning.main' };
  return { label: 'Low', color: 'error.main' };
}

const Stat = ({ label, value, valueColor, tooltip }) => {
  const content = (
    <Box>
      <Typography variant="overline" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: valueColor }}>
        {value}
      </Typography>
    </Box>
  );

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
};

const Rating = ({ userDps, benchmarkDps, dpsCeiling, thresholdWeeks, fit, dpsProgression }) => {
  const finalBands = dpsProgression?.at(-1);

  const benchmarkPct = userDps / benchmarkDps * 100;
  const pctOfCeiling = dpsCeiling ? clamp(userDps / dpsCeiling * 100, 0, 100) : null;
  const { grade, color: gradeColor } = getGrade(benchmarkPct);

  const equivalentWeek = estimateEquivalentWeek(userDps, dpsCeiling, fit);
  const milestones = getMilestones(thresholdWeeks);
  const nextMilestone = pctOfCeiling != null
    ? milestones.find((m) => m.threshold * 100 > pctOfCeiling)
    : null;

  const timePercentMore1 = estimateEquivalentWeek(userDps * 1.01, dpsCeiling, fit);
  const timePercentMore5 = estimateEquivalentWeek(userDps * 1.05, dpsCeiling, fit);
  const timePercentMore10 = estimateEquivalentWeek(userDps * 1.1, dpsCeiling, fit);

  const hasExtrapolated = milestones.some((m) => m.isExtrapolated);

  const efficiency = getEfficiencyLabel(fit?.q);
  const confidence = getConfidenceLabel(finalBands);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader title="Overall Rating" />

      <CardContent component={Stack} divider={<Divider />} spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
            {grade}
          </Typography>
          <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
            ({benchmarkPct.toFixed()}%)
          </Typography>
          <Typography variant="caption" color="textSecondary">
            of benchmark
          </Typography>
        </Stack>

        <Stack direction="row" divider={<Divider orientation="vertical" />} spacing={2}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, flex: 1 }}>
            <Stat label="Team DPS" value={formatNum(userDps)} />
            <Stat label="Benchmark" value={formatNum(benchmarkDps)} />
            {dpsCeiling != null && (
              <Stat label="Theoretical Max" value={formatNum(dpsCeiling)} />
            )}
            {confidence && (
              <Stat
                label="Simulation Confidence"
                value={confidence.label}
                valueColor={confidence.color}
                tooltip="How tightly the final week's simulated outcomes cluster around the mean"
              />
            )}
            {efficiency && (
              <Stat
                label="Farming Curve"
                value={efficiency.label}
                valueColor={efficiency.color}
                tooltip={`Diminishing-returns rate (q = ${fit.q.toFixed(2)}). Faster curves front-load most of the value early.`}
              />
            )}
          </Box>

          {(equivalentWeek != null || nextMilestone) && (
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>
                Estimated farming time
              </Typography>

              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  {formatNum(userDps)} dps (current)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  ~ {equivalentWeek.toFixed()} weeks
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  {formatNum(userDps * 1.01)} dps (+1%)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" color="textSecondary">
                    (+{(timePercentMore1 - equivalentWeek).toFixed()})
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ~ {timePercentMore1.toFixed()} weeks
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  {formatNum(userDps * 1.05)} dps (+5%)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" color="textSecondary">
                    (+{(timePercentMore5 - equivalentWeek).toFixed()})
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ~ {timePercentMore5.toFixed()} weeks
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Typography variant="body2" color="textSecondary">
                  {formatNum(userDps * 1.1)} dps (+10%)
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2" color="textSecondary">
                    (+{(timePercentMore10 - equivalentWeek).toFixed()})
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ~ {timePercentMore10.toFixed()} weeks
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          )}

          {milestones.length > 0 && (
            <Stack sx={{ flex: 1 }}>
              <Typography variant="overline" color="textSecondary">
                Milestones
              </Typography>
              <Stack>
                {milestones.map((m) => (
                  <Stack key={m.threshold} direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="textSecondary">
                      {Math.round(m.threshold * 100)}% of max
                    </Typography>
                    <Typography variant="caption">
                      {m.isExtrapolated ? '*' : ''}{formatNum(m.week)} weeks
                    </Typography>
                  </Stack>
                ))}
                {hasExtrapolated && (
                  <Typography variant="caption" color="textSecondary" sx={{ opacity: 0.7 }}>
                    * extrapolated from fitted trend, not directly observed
                  </Typography>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Rating;

