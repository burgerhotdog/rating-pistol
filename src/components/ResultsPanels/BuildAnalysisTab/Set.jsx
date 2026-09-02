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
import { SET } from '@/data';
import { useAccent, useData } from '@/hooks';
import { formatDmg, formatNum } from '@/utils';

function toComboKey(setCounts) {
  return Object.entries(setCounts)
    .map(([setId, count]) => `${setId}_${count}`)
    .join('+');
}

function toSetCounts(comboKey) {
  return Object.fromEntries(
    comboKey.split('+')
      .map((setStr) => {
        const [setId, count] = setStr.split('_');
        return [setId, Number(count)];
      })
  );
}

function limitSets(entries, userComboKey) {
  const top = entries.slice(0, 8);
  if (userComboKey == null || top.some(({ comboKey }) => comboKey === userComboKey)) {
    return top;
  }

  const userEntry = entries.find(({ comboKey }) => comboKey === userComboKey);
  if (!userEntry) return top;

  return [...top.slice(0, 7), userEntry].sort((a, b) => b.dps - a.dps);
}

function buildData(setResults, userDps, userComboKey) {
  const baselineDps = Object.entries(setResults)
    .find(([comboKey]) => comboKey === 'none')[1];

  const dataEntries = Object.entries(setResults)
    .filter(([comboKey, dps]) => comboKey === 'none' || dps > baselineDps)
    .map(([comboKey, dps]) => ({ comboKey, dps }))
    .sort((a, b) => b.dps - a.dps);

  const limitedEntries = limitSets(dataEntries, userComboKey);

  return limitedEntries.map(({ comboKey, dps }) => {
    const reOrderedKey = toComboKey(toSetCounts(comboKey));
    return {
      comboKey,
      name: comboKey,
      dps,
      pct: (dps / userDps) * 100,
      isUser: reOrderedKey === userComboKey,
    };
  });
}

function buildFullData(setResults, userDps, userComboKey) {
  const baselineDps = Object.entries(setResults)
    .find(([comboKey]) => comboKey === 'none')[1];

  const dataEntries = Object.entries(setResults)
    .filter(([comboKey, dps]) => comboKey === 'none' || dps > baselineDps)
    .map(([comboKey, dps]) => ({ comboKey, dps }))
    .sort((a, b) => b.dps - a.dps);

  return dataEntries.map(({ comboKey, dps }) => {
    const reOrderedKey = toComboKey(toSetCounts(comboKey));
    return {
      comboKey,
      name: comboKey,
      dps,
      pct: (dps / userDps) * 100,
      isUser: reOrderedKey === userComboKey,
    };
  });
}

const renderTooltip = ({ gameId, payload, label = '' }) => {
  const { dps = 0, pct = 0, isUser } = payload?.[0]?.payload ?? {};

  const labelParts = label.split('+');
  const adjustedLabelParts = label === 'none' ? 'None' : labelParts.map((part) => {
    const [id, count] = part.split('_');
    return `${SET[gameId][id]?.name} (${count}pc)`;
  }).join(' + ');

  const diff = pct - 100;
  const diffStr = diff > 0
    ? `+${diff.toFixed()}`
    : diff.toFixed();

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Typography variant="caption" color="textSecondary">
        {adjustedLabelParts}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="caption">
          {formatNum(dps)} dps
        </Typography>
        {!isUser && (
          <Typography
            variant="caption"
            color={diff > 0 ? 'success' : 'error'}
          >
            ({diffStr}%)
          </Typography>
        )}
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

  const userComboKey = toComboKey(userMember.setCounts);
  const data = buildData(setResults, userDps, userComboKey);
  const fullData = buildFullData(setResults, userDps, userComboKey);

  const tickFormatter = (v) => formatDmg(v);

  const barShape = (props) => {
    const { isUser, ...rest } = props;
    return (
      <Rectangle
        {...rest}
        fill="url(#gradient)"
        style={!isUser ? { filter: 'brightness(0.5)' } : undefined}
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

                const parts = entry.comboKey.split('+');

                if (parts.length === 1) {
                  const setId = parts[0].split('_')[0];
                  const icon = setDatas[setId].icon;
                  return (
                    <image
                      x={ix}
                      y={iy}
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
                  );
                }

                return (
                  <g>
                    {parts.toReversed().map((partStr, i) => {
                      const [id] = partStr.split('_');
                      const icon = setDatas[id].icon;
                      return (
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
                      );
                    })}
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
        maxWidth={false}
        fullWidth
        slotProps={{
          paper: {
            elevation: 2,
          },
        }}
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

                  const parts = entry.comboKey.split('+');
                  if (parts.length === 1) {
                    const setId = parts[0].split('_')[0];
                    const icon = setDatas[setId].icon;
                    return (
                      <image
                        x={ix}
                        y={iy}
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
                    );
                  }

                  return (
                    <g>
                      {parts.toReversed().map((partStr, i) => {
                        const [id] = partStr.split('_');
                        const icon = setDatas[id].icon;
                        return (
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
                        );
                      })}
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
