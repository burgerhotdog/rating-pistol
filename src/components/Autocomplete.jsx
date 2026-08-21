import { useMemo } from 'react';
import {
  Autocomplete as MuiAutocomplete,
  Avatar,
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';
import { GI, WW, WEAPON, SET, ECHO } from '@/data';

const ICON_SIZE = 24;

const Icon = ({ src }) => <img src={src} alt="" width={ICON_SIZE} height={ICON_SIZE} />;

const renderOption = (props, option) => {
  const { key, ...optionProps } = props;
  return (
    <ListItem key={key} {...optionProps}>
      <ListItemIcon>
        <Icon src={option.icon} />
      </ListItemIcon>
      <ListItemText primary={option.name} />
    </ListItem>
  );
};

export const Autocomplete = ({ options, value, label, onChange, ...props }) => {
  const renderInput = (params) => (
    <TextField
      {...params}
      label={label}
      slotProps={{
        ...params.slotProps,
        input: {
          ...params.slotProps?.input,
          startAdornment: value && <Icon src={value.icon} />,
        },
      }}
    />
  );

  return (
    <MuiAutocomplete
      {...props}
      options={options}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, option) => onChange(option?.id ?? null)}
      renderOption={renderOption}
      renderInput={renderInput}
    />
  );
};

const MultiAutocomplete = ({
  options,
  value,
  label,
  onChange,
  getOptionKey = (option) => option.id,
  ...props
}) => {
  const renderValue = (tagValue, getTagProps) =>
    tagValue.map((option, index) => {
      const { key, ...tagProps } = getTagProps({ index });
      return (
        <Chip
          key={key}
          avatar={<Avatar src={option.icon} />}
          label={option.bonus}
          {...tagProps}
        />
      );
    });

  const renderInput = (params) => (
    <TextField {...params} label={label} />
  );

  return (
    <MuiAutocomplete
      {...props}
      multiple
      options={options}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => getOptionKey(option) === getOptionKey(val)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderOption={renderOption}
      renderValue={renderValue}
      renderInput={renderInput}
    />
  );
};

export const WeapAutocomplete = ({ gameId, type, selected, ...props }) => {
  const options = useMemo(
    () => Object.values(WEAPON[gameId])
      .filter((weap) => weap.type === type)
      .sort((a, b) => b.quality - a.quality || a.name.localeCompare(b.name)),
    [gameId, type],
  );

  const value = options.find((option) => option.id === selected) ?? null;

  return (
    <Autocomplete
      {...props}
      options={options}
      value={value}
      groupBy={(option) => option.quality}
    />
  );
};

export const SetAutocomplete = ({ gameId, setCounts, onChange, ...props }) => {
  const numUsedPieces = Object.values(setCounts).reduce((acc, count) => acc + count, 0);
  const totalPieces = gameId === GI || gameId === WW ? 5 : 6;
  const maxBonus = totalPieces - numUsedPieces;

  const options = useMemo(() => {
    const options = [];
    for (let bonus = maxBonus; bonus > 0; bonus--) {
      for (const { name, version, id, icon, bonuses } of Object.values(SET[gameId])) {
        if (!bonuses.includes(bonus)) continue;
        options.push({ id, bonus, version, name, icon });
      }
    }

    return options.sort((a, b) =>
      b.bonus - a.bonus ||
      b.version - a.version ||
      Number(b.id) - Number(a.id)
    );
  }, [gameId, maxBonus]);

  const value = useMemo(
    () => Object.entries(setCounts)
      .map(([id, bonus]) => ({ id, bonus,
        name: SET[gameId][id].name,
        icon: SET[gameId][id].icon,
      }))
      .sort((a, b) => Number(b.id) - Number(a.id)),
    [gameId, setCounts],
  );

  const handleChange = (newValue) => {
    const nextCounts = { ...setCounts };
    const chosenIds = new Set(newValue.map((option) => option.id));

    // Removed sets: chip was deselected.
    for (const setId of Object.keys(nextCounts)) {
      if (!chosenIds.has(setId)) delete nextCounts[setId];
    }
    // Added/changed sets: last write wins if two tiers for the same set
    // were somehow both in newValue.
    for (const option of newValue) {
      nextCounts[option.id] = option.bonus;
    }

    onChange(nextCounts);
  };

  return (
    <MultiAutocomplete
      {...props}
      options={options}
      value={value}
      onChange={handleChange}
      getOptionKey={(option) => `${option.id}-${option.bonus}`}
      groupBy={(option) => option.bonus}
    />
  );
};

export const EchoAutocomplete = ({ sets, selected, ...props }) => {
  const options = useMemo(
    () => Object.values(ECHO)
      .filter((echo) => echo.sets.some((set) => sets.includes(set)))
      .sort((a, b) => b.cost - a.cost || a.name.localeCompare(b.name)),
    [sets],
  );

  const value = options.find((option) => option.id === selected) ?? null;

  return (
    <Autocomplete
      {...props}
      options={options}
      value={value}
      groupBy={(option) => option.cost}
    />
  );
};
