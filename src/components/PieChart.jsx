import { Box, Card, Paper, Tooltip as MuiTooltip, Typography } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ResponsiveContainer, Pie, PieChart, Tooltip, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#14b8a6'];

const renderLabel = ({ name, percent, x, y, midAngle }) => {
  if (percent < 0.05) return null;
  return `${(percent * 100).toFixed(0)}%`;
};

export const CustomPieChart = ({ breakdown }) => {
  if (!breakdown || !breakdown.length) return null;

  const total = breakdown.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, pt: 1.5, pb: 0 }}>
        <Typography variant="subtitle2" fontWeight="bold">Damage Breakdown</Typography>
        <MuiTooltip title="How each skill in the rotation contributes to total damage. Larger slices are the skills that matter most for your build." placement="top" arrow>
          <HelpOutlineIcon sx={{ fontSize: 13, color: 'text.disabled', cursor: 'help' }} />
        </MuiTooltip>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdown}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="70%"
              paddingAngle={2}
              label={renderLabel}
              labelLine={false}
              animationBegin={0}
              animationDuration={600}
            >
              {breakdown.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const { name, value } = payload[0].payload;
                const pct = ((value / total) * 100).toFixed(1);
                return (
                  <Paper
                    elevation={4}
                    sx={{
                      p: 1.5,
                      border: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">{name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pct}% of total
                    </Typography>
                  </Paper>
                );
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        </Box>
      </Box>
    </Card>
  );
};
