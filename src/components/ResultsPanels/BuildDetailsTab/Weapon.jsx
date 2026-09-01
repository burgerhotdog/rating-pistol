import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Rectangle,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useData } from '@/hooks';
import { formatDmg, formatNum, getDefaultWeapRank } from '@/utils';

const limitWeapons = (entries, weapDatas) => {
  let standardPicked = false;
  const limits = { 3: 1, 4: 3, 5: 3 };
  const counts = { 3: 0, 4: 0, 5: 0 };
  return entries.filter(({ weaponId }) => {
    const { quality, standard } = weapDatas[weaponId];
    if (standard && !standardPicked) {
      standardPicked = true;
      return true;
    }
    if (!limits[quality] || counts[quality] >= limits[quality]) {
      return false;
    }
    counts[quality]++;
    return true;
  });
};

function buildData(gameId, weapDatas, weaponResults, userDps) {
  const dataEntries = Object.entries(weaponResults)
    .map(([id, [dpsR1, dpsR5]]) => ({
      weaponId: Number(id),
      weaponRank: getDefaultWeapRank(gameId, id),
      dps: getDefaultWeapRank(gameId, id) === 5 ? dpsR5 : dpsR1,
    }))
    .sort((a, b) => b.dps - a.dps);

  const limitedEntries = limitWeapons(dataEntries, weapDatas);

  return limitedEntries.map(({ weaponId, weaponRank, dps }) => {
    return {
      weaponId,
      weaponRank,
      name: `${weapDatas[weaponId].name} R${weaponRank}`,
      icon: `${gameId}/weapon/${weaponId}.webp`,
      dps,
      pct: (dps / userDps) * 100,
    };
  });
}

function buildFullData(gameId, weapDatas, weaponResults, userDps) {
  const dataEntries = Object.entries(weaponResults)
    .flatMap(([id, [dpsR1, dpsR5]]) => [
      { weaponId: Number(id), weaponRank: 5, dps: dpsR5 },
      { weaponId: Number(id), weaponRank: 1, dps: dpsR1 },
    ])
    .sort((a, b) => b.dps - a.dps);

  return dataEntries.map(({ weaponId, weaponRank, dps }) => {
    return {
      weaponId,
      weaponRank,
      name: `${weapDatas[weaponId].name} R${weaponRank}`,
      icon: `${gameId}/weapon/${weaponId}.webp`,
      dps,
      pct: (dps / userDps) * 100,
    };
  });
}

const Weapon = ({ results }) => {
  const { weaponResults, userDps } = results;
  const { gameId } = useParams();
  const { palette, qualityColors } = useTheme();
  const weapDatas = useData('weapon');
  const [open, setOpen] = useState(false);

  const data = buildData(gameId, weapDatas, weaponResults, userDps);
  const fullData = buildFullData(gameId, weapDatas, weaponResults, userDps);

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
          data={data}
          style={{ width: '100%', height: '100%' }}
          responsive
        >
          <XAxis
            type="category"
            dataKey="name"
            tick={false}
          />

          <YAxis
            type="number"
            tickFormatter={(v) => formatDmg(v)}
          />

          <Bar
            dataKey="dps"
            shape={(props) => {
              const { weaponId, ...rest } = props;
              const { quality } = weapDatas[weaponId];
              return (
                <Rectangle
                  {...rest}
                  fill={qualityColors[quality]}
                  fillOpacity={0.6}
                />
              );
            }}
          >
            <LabelList
              content={({ x, y, width, height, index }) => {
                const entry = data[index];
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
                    xlinkHref={entry.icon}
                  />
                );
              }}
            />
          </Bar>

          <Tooltip
            content={({ payload, label }) => {
              const { dps = [] } = payload?.[0]?.payload ?? {};
              return (
                <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                  <Typography variant="caption" color="textSecondary">
                    {label}: {' '}
                  </Typography>
                  <Typography variant="caption">
                    {formatNum(dps)}
                  </Typography>
                </Paper>
              );
            }}
            cursor={{ fill: alpha(palette.text.primary, 0.1) }}
            isAnimationActive={false}
          />
        </BarChart>
      </CardContent>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        fullWidth
      >
        <DialogTitle>
          All Weapons
        </DialogTitle>

        <DialogContent sx={{ height: '80vh' }}>
          <BarChart
            data={fullData}
            style={{ width: '100%', height: '100%' }}
            responsive
          >
            <XAxis
              type="category"
              dataKey="name"
              tick={false}
            />

            <YAxis
              type="number"
              tickFormatter={(v) => formatDmg(v)}
            />

            <Bar
              dataKey="dps"
              shape={(props) => {
                const { weaponId, ...rest } = props;
                const { quality } = weapDatas[weaponId];
                return (
                  <Rectangle
                    {...rest}
                    fill={qualityColors[quality]}
                    fillOpacity={0.6}
                  />
                );
              }}
            >
              <LabelList
                content={({ x, y, width, height, index }) => {
                  const entry = fullData[index];
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
                      xlinkHref={entry.icon}
                    />
                  );
                }}
              />
            </Bar>

            <Tooltip
              content={({ payload, label }) => {
                const { dps = 0 } = payload?.[0]?.payload ?? {};
                return (
                  <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {label}: {' '}
                    </Typography>
                    <Typography variant="caption">
                      {formatNum(dps)}
                    </Typography>
                  </Paper>
                );
              }}
              cursor={{ fill: alpha(palette.text.primary, 0.1) }}
              isAnimationActive={false}
            />
          </BarChart>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Weapon;
