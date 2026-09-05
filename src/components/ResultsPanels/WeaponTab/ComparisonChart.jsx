import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  LabelList,
  Tooltip,
  XAxis,
  YAxis,
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

const ComparisonChart = ({ results }) => {
  const { weaponResults, userDps, userMember } = results;
  const { palette, qualityColors } = useTheme();
  const weapDatas = useData('weapon');
  const [open, setOpen] = useState(false);

  const userWeaponId = userMember.weaponId;

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

  const previewData = useMemo(() => {
    const hasAtLeastOne = {
      craftable: false,
      standard: false,
      quality3: false,
    };

    const noMoreThan = {
      total: 4,
      quality5: 1,
    };

    if (weapDatas[userWeaponId].standard) {
      hasAtLeastOne.standard = true;
      noMoreThan.total++;
    }

    if (weapDatas[userWeaponId].craftable) {
      hasAtLeastOne.craftable = true;
      noMoreThan.total++;
    }

    if (weapDatas[userWeaponId].quality3) {
      hasAtLeastOne.quality3 = true;
      noMoreThan.total++;
    }

    const filtered = data.filter(({ weaponId }) => {
      const { quality, standard, craftable } = weapDatas[weaponId];

      if (weaponId === userWeaponId) {
        return true;
      }

      if (!hasAtLeastOne.craftable && craftable) {
        hasAtLeastOne.craftable = true;
        return true;
      }

      if (!hasAtLeastOne.standard && standard) {
        hasAtLeastOne.standard = true;
        return true;
      }

      if (!hasAtLeastOne.quality3 && quality === 3) {
        hasAtLeastOne.quality3 = true;
        return true;
      }

      if (noMoreThan.total <= 0) return;
      if (quality === 5 && noMoreThan.quality5 <= 0) return;

      if (quality === 5) noMoreThan.quality5--;
      noMoreThan.total--;
      return true;
    });

    return [
      ...filtered,
      ...Array.from({ length: Math.max(0, 8 - filtered.length) }, (_, i) => ({
        comboKey: `empty-${i}`,
        name: `empty-${i}`,
        dps: 0,
        empty: true,
      })),
    ];
  }, [weapDatas, data, userWeaponId]);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Weapons"
        action={
          <Button onClick={() => setOpen(true)}>
            View all
          </Button>
        }
      />

      <CardContent component={Stack} sx={{ flex: 1 }}>
        <BarChart
          data={previewData}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <XAxis dataKey="name" tick={false} />
          <YAxis type="number" tickFormatter={formatDmg} />
          <Bar dataKey="dps">
            <LabelList
              content={({ x, y, width, height, index }) => {
                const entry = previewData[index];
                if (!entry?.icon) return null;

                const size = width - 16;
                const ix = x + 8;
                const iy = y + height - size - 8;

                return (
                  <image
                    x={ix}
                    y={iy}
                    width={size}
                    height={size}
                    href={entry.icon}
                    {...(!entry.isUser && { opacity: 0.5 })}
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
        </BarChart>
      </CardContent>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xl"
        fullWidth
        slotProps={{ paper: { elevation: 2 } }}
      >
        <DialogTitle>
          All Weapons
        </DialogTitle>

        <DialogContent sx={{ height: '80vh' }}>
          <BarChart
            data={data}
            style={{ width: '100%', height: '100%' }}
            responsive
          >
            <XAxis dataKey="name" tick={false} />
            <YAxis type="number" tickFormatter={formatDmg} />
            <Bar dataKey="dps">
              <LabelList
                content={({ x, y, width, height, index }) => {
                  const entry = data[index];
                  if (!entry?.icon) return null;

                  const size = width - 8;
                  const ix = x + 4;
                  const iy = y + height - size - 4;

                  return (
                    <image
                      x={ix}
                      y={iy}
                      width={size}
                      height={size}
                      href={entry.icon}
                      {...(!entry.isUser && { opacity: 0.5 })}
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
          </BarChart>
        </DialogContent>
      </Dialog>

      <svg width="0" height="0">
        <defs>
          {Object.entries(qualityColors).map(([q, qColor]) => (
            <linearGradient key={q} id={`gradient${q}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={qColor} stopOpacity={1} />
              <stop offset="100%" stopColor={qColor} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </Card>
  );
};

export default ComparisonChart;
