import { useParams } from 'react-router-dom';
import {
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
import { ECHO, SET } from '@/data';
import { useData } from '@/hooks';
import { formatDmg, formatNum, formatStr } from '@/utils';

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

function buildData(gameId, setResults, userDps, userSetCounts, limit = false) {
  const dataEntries = setResults.toSorted((a, b) => b.dps - a.dps);

  const userEquivKey = toEquivKey(gameId, userSetCounts);
  const isUser = (comboKey) => {
    const testSetCounts = toSetCounts(comboKey);
    const testEquivKey = toEquivKey(gameId, testSetCounts);
    return testEquivKey === userEquivKey;
  };

  let limitLeft = 6;
  const bestDps = dataEntries[0].dps;

  const data = dataEntries
    .filter(({ comboKey, dps }) => {
      if (!limit) return true;
      if (isUser(comboKey)) return true;
      if (comboKey === 'none') return true;

      if (limitLeft && (dps / bestDps) >= 0.9) {
        limitLeft--;
        return true;
      }
    })
    .map(({ comboKey, dps }) => ({
      comboKey,
      name: comboKey,
      dps,
      pct: (dps / userDps) * 100,
      isUser: isUser(comboKey),
      fill: "url(#accentGradient)",
      ...(!isUser(comboKey) && { filter: 'brightness(0.5)' }),
    }));

  return [
    ...data,
    ...Array.from({ length: Math.max(0, 8 - data.length) }, (_, i) => ({
      comboKey: `empty-${i}`,
      name: `empty-${i}`,
      dps: 0,
      empty: true,
    })),
  ];
}

const renderTooltip = ({ gameId, payload, label = '' }) => {
  if (!payload?.[0]?.payload) return;
  const { empty, dps, pct, isUser } = payload[0].payload;
  if (empty) return;

  const { setKey, echoId } = splitComboKey(label);
  const echoName = echoId != null ? ECHO[echoId]?.name : null;

  const labelParts = setKey.split('+');
  const adjustedLabelParts = setKey === 'none'
    ? ['None']
    : labelParts
      .map((part) => {
        const [id, count] = part.split('_');
        if (count !== '2') {
          return `${SET[gameId][id]?.name} (${count}pc)`;
        }

        return `${formatStr(SET[gameId][id]?.halfStat)} (${count}pc)`;
      });

  const diff = pct - 100;
  const diffStr = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);

  return (
    <Paper elevation={6} sx={{ px: 1, py: 0.5 }}>
      <Stack>
        {adjustedLabelParts.map((labelPart, i) => (
          <Typography key={i} variant="caption" color="textSecondary">
            {labelPart}
          </Typography>
        ))}
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

const SetBonusesChart = ({ results, open, onClose }) => {
  const { setResults, userDps, userMember } = results;
  const { gameId } = useParams();
  const { palette } = useTheme();
  const setDatas = useData('set');

  const data = buildData(gameId, setResults, userDps, userMember.setCounts, true);
  const fullData = buildData(gameId, setResults, userDps, userMember.setCounts);

  return (
    <>
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
              if (!entry?.comboKey || entry.empty || entry.comboKey === 'none') return null;

              const size = width - 16;
              const ix = x + 8;
              const iy = y + height - size - 8;

              const icons = getComboIcons(entry.comboKey, setDatas).toReversed();

              return (
                <g>
                  {icons.map((icon, i) => (
                    <image
                      key={i}
                      x={ix}
                      y={iy - i * (size + 8)}
                      width={size}
                      height={size}
                      href={icon}
                      {...(!entry.isUser && { opacity: 0.5 })}
                      filter={entry.filter}
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

      <Dialog
        open={open}
        onClose={onClose}
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
            <XAxis dataKey="name" tick={false} />
            <YAxis type="number" tickFormatter={formatDmg} />
            <Bar dataKey="dps">
              <LabelList
                content={({ x, y, width, height, index }) => {
                  const entry = fullData[index];
                  if (!entry?.comboKey || entry.empty || entry.comboKey === 'none') return null;

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
                          {...(!entry.isUser && { opacity: 0.5 })}
                          filter={entry.filter}
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
    </>
  );
};

export default SetBonusesChart;
