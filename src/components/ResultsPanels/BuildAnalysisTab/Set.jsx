import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
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
import { Button } from '../../Colored';

// the set the user actually has 4 pieces of equipped, if any
function getUserSetId(setCounts = {}) {
  const entry = Object.entries(setCounts).find(([, count]) => count >= 4);
  return entry ? Number(entry[0]) : null;
}

function limitSets(entries, userSetId) {
  const top = entries.slice(0, 8);
  if (userSetId == null || top.some(({ setId }) => setId === userSetId)) {
    return top;
  }

  const userEntry = entries.find(({ setId }) => setId === userSetId);
  if (!userEntry) return top;

  return [...top.slice(0, 7), userEntry].sort((a, b) => b.dps - a.dps);
}

function buildData(gameId, setDatas, setResults, userDps, userSetId) {
  const dataEntries = Object.entries(setResults)
    .map(([id, dps]) => ({ setId: Number(id), dps }))
    .sort((a, b) => b.dps - a.dps);

  const limitedEntries = limitSets(dataEntries, userSetId);

  return limitedEntries.map(({ setId, dps }) => {
    return {
      setId,
      name: setDatas[setId].name,
      icon: setDatas[setId].icon,
      dps,
      pct: (dps / userDps) * 100,
      isUser: setId === userSetId,
    };
  });
}

function buildFullData(gameId, setDatas, setResults, userDps, userSetId) {
  const dataEntries = Object.entries(setResults)
    .map(([id, dps]) => ({ setId: Number(id), dps }))
    .sort((a, b) => b.dps - a.dps);

  return dataEntries.map(({ setId, dps }) => {
    return {
      setId,
      name: setDatas[setId].name,
      icon: setDatas[setId].icon,
      dps,
      pct: (dps / userDps) * 100,
      isUser: setId === userSetId,
    };
  });
}

const renderTooltip = ({ payload, label }) => {
  const { dps = 0, pct = 0, isUser } = payload?.[0]?.payload ?? {};
  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="caption" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block' }}>
        {formatNum(dps)} dps · {pct.toFixed(0)}% of your build
      </Typography>
      {isUser && (
        <Typography variant="caption" color="warning.main" sx={{ display: 'block', fontWeight: 600 }}>
          Your pick
        </Typography>
      )}
    </Paper>
  );
};

const Set = ({ results }) => {
  const { setResults, userDps, userMember } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const setDatas = useData('set');
  const accent = useAccent();
  const [open, setOpen] = useState(false);

  const userSetId = getUserSetId(userMember?.setCounts);
  const data = buildData(gameId, setDatas, setResults, userDps, userSetId);
  const fullData = buildFullData(gameId, setDatas, setResults, userDps, userSetId);

  const tickFormatter = (v) => formatDmg(v);

  const barShape = (props) => {
    const { isUser, ...rest } = props;
    return (
      <Rectangle
        {...rest}
        fill={accent}
        fillOpacity={isUser ? 1 : 0.6}
        stroke={isUser ? palette.text.primary : 'none'}
        strokeWidth={isUser ? 2 : 0}
      />
    );
  };

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Sets"
        action={
          <Button color={accent} onClick={() => setOpen(true)}>
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
            tickFormatter={tickFormatter}
          />

          <Bar
            dataKey="dps"
            shape={barShape}
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
            content={renderTooltip}
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
              tickFormatter={tickFormatter}
            />

            <Bar
              dataKey="dps"
              shape={barShape}
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
              content={renderTooltip}
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
