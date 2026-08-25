import { useState } from 'react'; 
import {
  Card,
  InputAdornment,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';
import { Autocomplete } from '../Autocomplete';

const EquipsTab = ({ draft, setDraft }) => {
  const [tab, setTab] = useState(0);
  const sets = useData('set');
  const echoes = useData('echo');
  const mainstats = useData('mainstat');
  const substatsData = useData('substat');

  const equipList = draft.equipList;
  const setsLock = new Set(equipList.map((equip) => equip.setId));

  const equip = equipList[tab];

  return (
    <Stack spacing={1}>
      <Tabs
        component={Card}
        value={tab}
        onChange={(_, value) => setTab(value)}
        centered
      >
        {equipList.map((_, index) => <Tab key={index} value={index} label={index} />)}
      </Tabs>

      <Stack spacing={1}>
        <Stack direction="row" spacing={1}>
          <Autocomplete
            options={Object.values(sets)}
            valueId={equip?.setId ?? null}
            onChange={(setId) => setDraft((prev) => {
              const equip = prev.equipList[tab];
              return {
                ...prev,
                equipList: prev.equipList.with(tab, {
                  ...equip,
                  setId,
                }),
              };
            })}
            sx={{ flex: 2 }}
          />
          <TextField
            select
            label="Cost"
            value={equip?.cost ?? ''}
            onChange={(e) => setDraft((prev) => {
              const equip = prev.equipList[tab];
              return {
                ...prev,
                equipList: prev.equipList.with(tab, {
                  ...equip,
                  cost: e.target.value === ''
                    ? null
                    : e.target.value,
                }),
              };
            })}
            sx={{ flex: 1 }}
          >
            {[4, 3, 1].map((cost) => (
              <MenuItem key={cost} value={cost}>
                {cost}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            select
            label="Mainstat"
            value={equip?.mainstatId ?? ''}
            onChange={(e) => setDraft((prev) => {
              const equip = prev.equipList[tab];
              return {
                ...prev,
                equipList: prev.equipList.with(tab, {
                  ...equip,
                  mainstatId: e.target.value === ''
                    ? null
                    : e.target.value,
                }),
              };
            })}
            sx={{ flex: 2 }}
          >
            {Object.keys(mainstats[equip?.cost] ?? {}).map((id) => (
              <MenuItem key={id} value={id}>
                {formatStr(id)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            type="number"
            value={!equip.mainstatValue
              ? ''
              : equip.mainstatId.endsWith('%')
                ? (equip.mainstatValue / 100).toFixed(1)
                : equip.mainstatValue.toFixed()
            }
            onChange={(e) => setDraft((prev) => {
              const equip = prev.equipList[tab];
              return {
                ...prev,
                equipList: prev.equipList.with(tab, {
                  ...equip,
                  mainstatValue: e.target.value === ''
                    ? null
                    : equip.mainstatId.endsWith('%')
                      ? Number(e.target.value) * 100
                      : Number(e.target.value),
                }),
              };
            })}
            slotProps={{
              input: {
                endAdornment: equip.mainstatId.endsWith('%')
                  ? <InputAdornment position="end">%</InputAdornment>
                  : null,
              },
            }}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField
            value={formatStr(equip.mainstatSubId ?? '')}
            disabled
            sx={{ flex: 2 }}
          />
          <TextField
            value={equip.mainstatSubValue ?? ''}
            disabled={!equip.mainstatSubId}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            Substats
          </Typography>

          {equip.substats.map((substat, subIndex) => {
            const isPercent = substat?.id && substat.id.endsWith('%');
            return (
              <Stack key={subIndex} direction="row" spacing={1}>
                <TextField
                  select
                  value={substat?.id ?? ''}
                  onChange={(e) => setDraft((prev) => {
                    const equip = prev.equipList[tab];
                    const substat = equip.substats[subIndex];
                    return {
                      ...prev,
                      equipList: prev.equipList.with(tab, {
                        ...equip,
                        substats: equip.substats.with(subIndex, {
                          ...substat,
                          id: e.target.value === ''
                            ? null
                            : e.target.value,
                        }),
                      }),
                    };
                  })}
                  sx={{ flex: 2 }}
                >
                  {Object.keys(substatsData).map((id) => (
                    <MenuItem key={id} value={id}>
                      {formatStr(id)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="number"
                  value={!substat?.value
                    ? ''
                    : isPercent
                      ? (substat.value / 100).toFixed(1)
                      : substat.value.toFixed()
                  }
                  onChange={(e) => setDraft((prev) => {
                    const equip = prev.equipList[tab];
                    const substat = equip.substats[subIndex];
                    return {
                      ...prev,
                      equipList: prev.equipList.with(tab, {
                        ...equip,
                        substats: equip.substats.with(subIndex, {
                          ...substat,
                          value: e.target.value === ''
                            ? null
                            : isPercent
                              ? Number(e.target.value) * 100
                              : Number(e.target.value),
                        }),
                      }),
                    };
                  })}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ visibility: substat?.id.endsWith('%') ? 'visible' : 'hidden' }}
                        >
                          %
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ flex: 1 }}
                />
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Autocomplete
        options={Object.values(echoes)
          .filter((echo) => echo.sets.some((set) => setsLock.has(set)))
          .sort((a, b) =>
            b.cost - a.cost ||
            b.version - a.version ||
            Number(b.id) - Number(a.id)
          )
        }
        groupBy={(echo) => echo.cost}
        valueId={draft.mainEcho}
        onChange={(mainEcho) => setDraft((prev) => ({ ...prev, mainEcho }))}
        disabled={!draft.id}
      />
    </Stack>
  );
};

export default EquipsTab;
