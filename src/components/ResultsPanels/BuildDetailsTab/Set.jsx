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
import { useAccent, useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

function buildData(gameId, setDatas, setResults, userDps) {
  const dataEntries = Object.entries(setResults)
    .map(([id, dps]) => ({ setId: Number(id), dps }))
    .sort((a, b) => b.dps - a.dps)
    .slice(0, 8);

  return dataEntries.map(({ setId, dps }) => {
    return {
      setId,
      name: setDatas[setId].name,
      icon: setDatas[setId].icon,
      dps,
      pct: (dps / userDps) * 100,
    };
  });
}

function buildFullData(gameId, setDatas, weaponResults, userDps) {
  const dataEntries = Object.entries(weaponResults)
    .flatMap(([id, dps]) => ({ setId: Number(id), dps }))
    .sort((a, b) => b.dps - a.dps);

  return dataEntries.map(({ setId, dps }) => {
    return {
      setId,
      name: setDatas[setId].name,
      icon: setDatas[setId].icon,
      dps,
      pct: (dps / userDps) * 100,
    };
  });
}

const Set = ({ results }) => {
  const { setResults, userDps } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const setDatas = useData('set');
  const accent = useAccent();
  const [open, setOpen] = useState(false);

  const data = buildData(gameId, setDatas, setResults, userDps);
  const fullData = buildFullData(gameId, setDatas, setResults, userDps);

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Sets"
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
              return (
                <Rectangle
                  {...props}
                  fill={accent}
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
          All Sets
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
                return (
                  <Rectangle
                    {...props}
                    fill={accent}
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

export default Set;
