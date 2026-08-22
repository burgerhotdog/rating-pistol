import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { clamp, formatNum } from '@/utils';

const GRADE_BANDS = [
  { floor: 90, letter: 'A', color: '#4ade80' },
  { floor: 80, letter: 'B', color: '#86efac' },
  { floor: 70, letter: 'C', color: '#fbbf24' },
  { floor: 60, letter: 'D', color: '#f97316' },
];

function getGrade(pct, allowSuper) {
  if (allowSuper && pct > 100) return { grade: 'S', color: '#FFD700' };

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
  if (remaining <= 0) return null;
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
  const [gradeBasis, setGradeBasis] = useState('benchmark');
  const [milestonesOpen, setMilestonesOpen] = useState(false);

  const finalBands = dpsProgression?.at(-1);

  const benchmarkPct = userDps / benchmarkDps * 100;
  const pctOfCeiling = dpsCeiling ? clamp(userDps / dpsCeiling * 100, 0, 100) : null;
  const activePct = gradeBasis === 'ceiling' && pctOfCeiling != null ? pctOfCeiling : benchmarkPct;
  const { grade, color: gradeColor } = getGrade(activePct, gradeBasis === 'benchmark');

  const equivalentWeek = estimateEquivalentWeek(userDps, dpsCeiling, fit);
  const milestones = getMilestones(thresholdWeeks);
  const nextMilestone = pctOfCeiling != null
    ? milestones.find((m) => m.threshold * 100 > pctOfCeiling)
    : null;
  const hasExtrapolated = milestones.some((m) => m.isExtrapolated);

  const efficiency = getEfficiencyLabel(fit?.q);
  const confidence = getConfidenceLabel(finalBands);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Overall Rating"
        action={
          pctOfCeiling != null && (
            <ToggleButtonGroup
              value={gradeBasis}
              onChange={(_, next) => next && setGradeBasis(next)}
              size="small"
              exclusive
            >
              <ToggleButton value="benchmark">
                <Tooltip title="Grade against the realistic long-term farming benchmark">
                  <span>Benchmark</span>
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="ceiling">
                <Tooltip title="Grade against the theoretical best-possible build">
                  <span>Ceiling</span>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          )
        }
      />

      <CardContent component={Stack} spacing={1.5}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ color: gradeColor, fontWeight: 'bold' }}>
            {grade}
          </Typography>
          <Typography variant="body1" sx={{ color: gradeColor, opacity: 0.7 }}>
            ({activePct.toFixed()}%)
          </Typography>
          <Typography variant="caption" color="textSecondary">
            vs {gradeBasis === 'ceiling' ? 'theoretical max' : 'benchmark'}
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
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
          <>
            <Divider />
            <Stack spacing={0.75}>
              {equivalentWeek != null && (
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="textSecondary">
                    Equivalent Farming Time
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    ~{equivalentWeek.toFixed(1)} wks
                  </Typography>
                </Stack>
              )}
              {nextMilestone && (
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="textSecondary">
                    Next Milestone ({Math.round(nextMilestone.threshold * 100)}%)
                  </Typography>
                  <Tooltip title={nextMilestone.isExtrapolated ? 'Extrapolated from fitted trend' : 'Observed in simulation'}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      ~wk {nextMilestone.week.toFixed(1)}{nextMilestone.isExtrapolated ? '*' : ''}
                    </Typography>
                  </Tooltip>
                </Stack>
              )}
            </Stack>
          </>
        )}

        {milestones.length > 0 && (
          <>
            <Divider />
            <Accordion
              expanded={milestonesOpen}
              onChange={(_, expanded) => setMilestonesOpen(expanded)}
              disableGutters
              square
              sx={{ boxShadow: 'none', bgcolor: 'transparent', '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0, minHeight: 0 }}>
                <Typography variant="overline" color="textSecondary">
                  Farming Milestones
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0 }}>
                <Stack spacing={0.5}>
                  {milestones.map((m) => (
                    <Stack key={m.threshold} direction="row" sx={{ justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="textSecondary">
                        {Math.round(m.threshold * 100)}% of max
                      </Typography>
                      <Typography variant="caption">
                        wk {m.week.toFixed(1)}{m.isExtrapolated ? '*' : ''}
                      </Typography>
                    </Stack>
                  ))}
                  {hasExtrapolated && (
                    <Typography variant="caption" color="textSecondary" sx={{ opacity: 0.7 }}>
                      * extrapolated from fitted trend, not directly observed
                    </Typography>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Rating;

