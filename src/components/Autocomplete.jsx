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

const Icon = ({ src }) => (
  <img src={src} alt="" width={ICON_SIZE} height={ICON_SIZE} />
);

const renderOption = (props, option) => {
  const { key, ...optionProps } = props;
  return (
    <ListItem key={key} {...optionProps}>
      <ListItemIcon>
        <Icon src={option.iconSrc} />
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
          startAdornment: value && <Icon src={value.iconSrc} />,
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

export const MultiAutocomplete = ({
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
          avatar={<Avatar src={option.iconSrc} alt="" />}
          label={`(${option.bonus}) ${option.name}`}
          {...tagProps}
        />
      );
    });

  const renderInput = (params) => <TextField {...params} label={label} />;

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
      .sort((a, b) => b.quality - a.quality || a.name.localeCompare(b.name))
      .map((weap) => ({ ...weap, iconSrc: `${gameId}/weapon/${weap.id}.webp` })),
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

function buildOptions(gameId, maxBonus) {
  const options = [];
  for (let bonus = maxBonus; bonus > 0; bonus--) {
    for (const setId in SET[gameId]) {
      const set = SET[gameId][setId];
      if (set.bonuses.includes(bonus)) {
        options.push({
          id: setId,
          name: set.name,
          iconSrc: `${gameId}/set/${setId}.webp`,
          bonus,
        });
      }
    }
  }

  return options.sort((a, b) => b.bonus - a.bonus || a.name.localeCompare(b.name));
}

function highestActiveBonus(bonuses, count) {
  return bonuses
    .filter((bonus) => bonus <= count)
    .sort((a, b) => b - a)[0];
}

export const SetAutocomplete = ({ gameId, setCounts, onChange, ...props }) => {
  const numUsedPieces = Object.values(setCounts).reduce((acc, count) => acc + count, 0);
  const totalPieces = gameId === GI || gameId === WW ? 5 : 6;
  const maxBonus = totalPieces - numUsedPieces;

  const options = useMemo(
    () => buildOptions(gameId, maxBonus),
    [gameId, maxBonus],
  );

  const value = useMemo(() => {
    const selected = [];
    for (const [setId, count] of Object.entries(setCounts)) {
      const set = SET[gameId][setId];
      if (!set) continue;
      const bonus = highestActiveBonus(set.bonuses, count);
      if (bonus === undefined) continue;
      selected.push({
        id: setId,
        name: set.name,
        iconSrc: `${gameId}/set/${setId}.webp`,
        bonus,
      });
    }
    return selected;
  }, [gameId, setCounts]);

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
      .sort((a, b) => b.cost - a.cost || a.name.localeCompare(b.name))
      .map((echo) => ({ ...echo, iconSrc: `${WW}/echo/${echo.id}.webp` })),
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
