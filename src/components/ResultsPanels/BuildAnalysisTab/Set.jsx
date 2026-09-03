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
import { ECHO, SET } from '@/data';
import { useAccent, useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

function toComboKey(setCounts) {
  return Object.entries(setCounts)
    .map(([setId, count]) => `${setId}_${count}`)
    .join('+');
}

// Trailing `|<echoId>` encodes the main echo that produced the result, if any
function splitComboKey(comboKey) {
  const separatorIndex = comboKey.indexOf('|');
  return separatorIndex === -1
    ? { setKey: comboKey, echoId: null }
    : { setKey: comboKey.slice(0, separatorIndex), echoId: Number(comboKey.slice(separatorIndex + 1)) };
}

function toSetCounts(comboKey) {
  if (comboKey === 'none') return {};
  const { setKey } = splitComboKey(comboKey);
  return Object.fromEntries(
    setKey.split('+')
      .map((setStr) => {
        const [setId, count] = setStr.split('_');
        return [setId, Number(count)];
      })
  );
}

function getComboIcons(comboKey, setDatas) {
  const { setKey, echoId } = splitComboKey(comboKey);
  const icons = setKey.split('+').map((partStr) => setDatas[partStr.split('_')[0]]?.icon);
  if (echoId != null) icons.push(ECHO[echoId]?.icon);
  return icons.filter(Boolean);
}

function limitSets(entries, userComboKey, isUser) {
  const top = entries.slice(0, 8);
  if (
    userComboKey == null ||
    top.some(({ comboKey }) => isUser(comboKey))
  ) {
    return top;
  }

  const userEntry = entries.find(({ comboKey }) => isUser(comboKey));
  if (!userEntry) return top;

  return [...top.slice(0, 7), userEntry].sort((a, b) => b.dps - a.dps);
}

const toEquivKey = (gameId, setCounts) =>
  Object.entries(setCounts)
    .map(([id, count]) => {
      const { halfStat } = SET[gameId][id];

      if (count !== 2 || !halfStat) {
        return `${id}_${count}`;
      }

      return `${halfStat}_${count}`;
    })
    .join('+');

function buildData(gameId, setResults, userDps, userSetCounts) {
  const baselineDps = Object.entries(setResults)
    .find(([comboKey]) => comboKey === 'none')[1];

  const dataEntries = Object.entries(setResults)
    .filter(([comboKey, dps]) => comboKey === 'none' || dps > baselineDps)
    .map(([comboKey, dps]) => ({ comboKey, dps }))
    .sort((a, b) => b.dps - a.dps);

  const userComboKey = toComboKey(userSetCounts);
  const userEquivKey = toEquivKey(gameId, userSetCounts);

  const isUser = (comboKey) => {
    const testSetCounts = toSetCounts(comboKey);
    const testEquivKey = toEquivKey(gameId, testSetCounts);
    return testEquivKey === userEquivKey;
  };

  const limitedEntries = limitSets(dataEntries, userComboKey, isUser);

  return limitedEntries.map(({ comboKey, dps }) => {
    return {
      comboKey,
      name: comboKey,
      dps,
      pct: (dps / userDps) * 100,
      isUser: isUser(comboKey),
    };
  });
}

function buildFullData(gameId, setResults, userDps, userSetCounts) {
  const baselineDps = Object.entries(setResults)
    .find(([comboKey]) => comboKey === 'none')[1];

  const dataEntries = Object.entries(setResults)
    .filter(([comboKey, dps]) => comboKey === 'none' || dps > baselineDps)
    .map(([comboKey, dps]) => ({ comboKey, dps }))
    .sort((a, b) => b.dps - a.dps);

  const userEquivKey = toEquivKey(gameId, userSetCounts);

  const isUser = (comboKey) => {
    const testSetCounts = toSetCounts(comboKey);
    const testEquivKey = toEquivKey(gameId, testSetCounts);
    return testEquivKey === userEquivKey;
  };

  return dataEntries.map(({ comboKey, dps }) => {
    return {
      comboKey,
      name: comboKey,
      dps,
      pct: (dps / userDps) * 100,
      isUser: isUser(comboKey),
    };
  });
}

const renderTooltip = ({ gameId, payload, label = '' }) => {
  const { dps = 0, pct = 0, isUser } = payload?.[0]?.payload ?? {};

  const { setKey, echoId } = splitComboKey(label);
  const echoName = echoId != null ? ECHO[echoId]?.name : null;

  const labelParts = setKey.split('+');
  const adjustedLabelParts = setKey === 'none' ? 'None' : labelParts.map((part) => {
    const [id, count] = part.split('_');
    return `${SET[gameId][id]?.name} (${count}pc)`;
  }).join(' + ');

  const diff = pct - 100;
  const diffStr = diff >= 0
    ? `+${diff.toFixed(1)}`
    : diff.toFixed(1);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Stack>
        <Typography variant="caption" color="textSecondary">
          {adjustedLabelParts}
        </Typography>
        {echoName && (
          <Typography variant="caption" color="textSecondary">
            {echoName}
          </Typography>
        )}
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
      </Stack>
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

  const data = buildData(gameId, setResults, userDps, userMember.setCounts);
  const fullData = buildFullData(gameId, setResults, userDps, userMember.setCounts);

  const tickFormatter = (v) => formatDmg(v);

  const barShape = (props) => {
    const { isUser, ...rest } = props;
    return (
      <Rectangle
        {...rest}
        fill="url(#gradient)"
        style={!isUser
          ? { filter: 'brightness(0.5)' }
          : undefined
        }
      />
    );
  };

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
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity={1} />
              <stop offset="100%" stopColor={accent} stopOpacity={0} />
            </linearGradient>
          </defs>

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
                if (!entry?.comboKey || entry.comboKey === 'none') return null;

                const size = width - 16;
                const ix = x + 8;
                const iy = y + height - size - 8;

                const icons = getComboIcons(entry.comboKey, setDatas);

                return (
                  <g>
                    {icons.toReversed().map((icon, i) => (
                      <image
                        key={i}
                        x={ix}
                        y={iy - i * (size + 8)}
                        width={size}
                        height={size}
                        href={icon}
                        xlinkHref={icon}
                        opacity={!entry.isUser
                          ? 0.5
                          : undefined
                        }
                        style={!entry.isUser
                          ? { filter: 'brightness(0.5)' }
                          : undefined
                        }
                      />
                    ))}
                  </g>
                );
              }}
            />
          </Bar>

          <Tooltip
            content={(props) => renderTooltip({ gameId, ...props })}
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
                  if (!entry?.comboKey || entry.comboKey === 'none') return null;

                  const size = width - 8;
                  const ix = x + 4;
                  const iy = y + height - size - 4;

                  const icons = getComboIcons(entry.comboKey, setDatas);

                  return (
                    <g>
                      {icons.toReversed().map((icon, i) => (
                        <image
                          key={i}
                          x={ix}
                          y={iy - i * (size + 4)}
                          width={size}
                          height={size}
                          href={icon}
                          xlinkHref={icon}
                          opacity={!entry.isUser
                            ? 0.5
                            : undefined
                          }
                          style={!entry.isUser
                            ? { filter: 'brightness(0.5)' }
                            : undefined
                          }
                        />
                      ))}
                    </g>
                  );
                }}
              />
            </Bar>

            <Tooltip
              content={(props) => renderTooltip({ gameId, ...props })}
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
