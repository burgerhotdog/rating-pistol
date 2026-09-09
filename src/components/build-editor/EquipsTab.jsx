import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { WW } from '@/data';
import { useData } from '@/hooks';
import { formatStr } from '@/utils';
import { Autocomplete } from '../Autocomplete';

const EquipsTab = ({ draft, setDraft }) => {
  const { gameId } = useParams();
  const [tab, setTab] = useState(0);

  const equipList = draft?.equipList ?? [];
  const equip = equipList?.[tab];

  const setData = useData('set');
  const setOptions = useMemo(
    () => Object.values(setData)
      .sort((a, b) =>
        b.version - a.version ||
        b.id - a.id
      ),
    [setData],
  );

  const echoData = useData('echo');
  const echoOptions = useMemo(
    () => Object.values(echoData)
      .filter((echo) =>
        echo.sets.includes(equip?.setId)
      )
      .sort((a, b) =>
        b.cost - a.cost ||
        b.version - a.version ||
        b.id - a.id
      ),
    [echoData, equip],
  );

  const mainstatData = useData('mainstat');
  const mainstatKey = gameId === WW ? equip?.cost : tab;
  const mainstatOptions = Object.keys(mainstatData[mainstatKey] ?? {});
  const mainstatIsPercent = equip?.mainstatId?.endsWith('%') ?? false;

  const substats = equip?.substats ?? [];
  const substatData = useData('substat');
  const substatOptions = Object.keys(substatData);

  const updateEquip = (key, value) => {
    setDraft((prev) => {
      const equip = prev.equipList[tab];

      return {
        ...prev,
        equipList: prev.equipList.with(tab, {
          ...equip,
          [key]: value,
        }),
      };
    });
  };

  const parseValue = (value, isPercent = 'str') =>
    value === ''
      ? null
      : isPercent === 'str'
        ? value
        : isPercent
          ? Number(value) * 100
          : Number(value);

  return (
    <Stack spacing={2}>
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
            options={setOptions}
            valueId={equip?.setId ?? null}
            onChange={(setId) => updateEquip('setId', setId)}
            label="Set"
            sx={{ flex: 2 }}
          />

          {gameId === WW && (
            <>
              <TextField
                select
                label="Cost"
                value={equip?.cost ?? ''}
                onChange={(e) => updateEquip('cost', parseValue(e.target.value))}
                sx={{ flex: 1 }}
              >
                {[4, 3, 1].map((cost) => (
                  <MenuItem key={cost} value={cost}>
                    {cost}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                options={echoOptions}
                groupBy={(echo) => echo.cost}
                valueId={equip?.echoId}
                onChange={(echoId) => updateEquip('echoId', echoId)}
                label="Echo"
                sx={{ flex: 2 }}
                disabled={!equip}
              />
            </>
          )}
        </Stack>

        <Typography variant="subtitle2">
          Mainstat
        </Typography>

        <Stack direction="row" spacing={1}>
          <TextField
            select
            value={equip?.mainstatId ?? ''}
            onChange={(e) => updateEquip('mainstatId', parseValue(e.target.value))}
            sx={{ flex: 3 }}
          >
            {mainstatOptions.map((id) => (
              <MenuItem key={id} value={id}>
                {formatStr(id)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            value={!equip?.mainstatValue
              ? ''
              : mainstatIsPercent
                ? (equip?.mainstatValue / 100).toFixed(1)
                : equip?.mainstatValue.toFixed()
            }
            onChange={(e) => updateEquip('mainstatValue', parseValue(e.target.value, mainstatIsPercent))}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ visibility: mainstatIsPercent ? 'visible' : 'hidden' }}
                  >
                    %
                  </InputAdornment>
                ),
              },
            }}
            sx={{ flex: 1 }}
          />
        </Stack>

        {gameId === WW && (
          <Stack direction="row" spacing={1}>
            <TextField
              value={formatStr(equip?.mainstatSubId ?? '')}
              disabled
              sx={{ flex: 3 }}
            />
            <TextField
              value={equip?.mainstatSubValue ?? ''}
              onChange={(e) => updateEquip('mainstatSubValue', parseValue(e.target.value, false))}
              disabled={!equip?.mainstatSubId}
              sx={{ flex: 1 }}
            />
          </Stack>
        )}

        <Stack spacing={1}>
          <Typography variant="subtitle2">
            Substats
          </Typography>

          {substats.map((substat, subIndex) => {
            const isPercent = substat?.id && substat.id.endsWith('%');
            const updateSubstat = (key, value) => {
              setDraft((prev) => {
                const equip = prev.equipList[tab];
                const substat = equip.substats[subIndex];

                return {
                  ...prev,
                  equipList: prev.equipList.with(tab, {
                    ...equip,
                    substats: equip.substats.with(subIndex, {
                      ...substat,
                      [key]: value,
                    }),
                  }),
                };
              });
            }

            return (
              <Stack key={subIndex} direction="row" spacing={1}>
                <TextField
                  select
                  value={substat?.id ?? ''}
                  onChange={(e) => updateSubstat('id', parseValue(e.target.value))}
                  sx={{ flex: 3 }}
                >
                  {substatOptions.map((id) => (
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
                  onChange={(e) => updateSubstat('value', parseValue(e.target.value, isPercent))}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{ visibility: isPercent ? 'visible' : 'hidden' }}
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
    </Stack>
  );
};

export default EquipsTab;
