import { useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle, Paper, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

const renderTooltip = ({ payload, label }) => {
  const { empty, dps = 0, pct = 0, isUser } = payload?.[0]?.payload ?? {};
  if (empty) return;

  const diff = pct - 100;
  const diffStr = diff >= 0
    ? `+${diff.toFixed(1)}`
    : diff.toFixed(1);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="caption">
          {formatNum(dps)} dps
        </Typography>
        {!isUser && (
          <Typography
            variant="caption"
            color={diff >= 0 ? 'success' : 'error'}
          >
            ({diffStr}%)
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

const WeaponsDialog = ({ results, open, onClose }) => {
  const { userMember, userDps, weaponResults } = results;
  const userWeaponId = userMember.weaponId;
  const { palette, qualityColors } = useTheme();
  const weapDatas = useData('weapon');
  const langData = useData('lang');

  const data = useMemo(
    () => weaponResults
      .toSorted((a, b) => b.dps - a.dps)
      .map(({ weaponId, weaponRank, dps }) => {
        const { name, icon, quality } = weapDatas[weaponId];
        const isUser = weaponId === userWeaponId;

        return {
          weaponId,
          weaponRank,
          name: `${name} R${weaponRank}`,
          icon,
          dps,
          pct: (dps / userDps) * 100,
          isUser,
          fill: `url(#gradient${quality})`,
          ...(!isUser && { filter: 'brightness(0.5)' }),
        };
      }),
    [weapDatas, weaponResults, userWeaponId, userDps],
  );

  const chartHeight = data.length * 64 + 40;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>{`${langData.Weapon} Rankings`}</DialogTitle>
      <DialogContent
        dividers
        sx={{ overflowY: 'auto', p: 2 }}
      >
        <BarChart
          data={data}
          layout="vertical"
          style={{
            width: '100%',
            height: chartHeight,
          }}
          responsive
        >
          <XAxis
            type="number"
            tickFormatter={formatDmg}
          />

          <YAxis
            type="category"
            dataKey="name"
            tick={false}
          />

          <Bar
            dataKey="dps"
            barSize={48}
            animationMatchBy={matchByDataKey('name')}
          >
            <LabelList
              content={({ x, y, height, index }) => {
                const entry = data[index];
                if (!entry?.icon) return null;

                const size = Math.max(height - 8, 48);
                const ix = x + 8;
                const iy = y + (height - size) / 2;

                return (
                  <image
                    x={ix}
                    y={iy}
                    width={size}
                    height={size}
                    href={entry.icon}
                    {...(!entry.isUser && { opacity: 0.75 })}
                    filter={entry.filter}
                  />
                );
              }}
            />
          </Bar>

          <Tooltip
            content={renderTooltip}
            cursor={{ fill: alpha(palette.text.primary, 0.1) }}
            isAnimationActive={false}
          />

          <defs>
            {Object.entries(qualityColors).map(([q, qColor]) => (
              <linearGradient key={q} id={`gradient${q}`} x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor={qColor} stopOpacity={1} />
                <stop offset="100%" stopColor={qColor} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
        </BarChart>
      </DialogContent>
    </Dialog>
  );
};

export default WeaponsDialog;
