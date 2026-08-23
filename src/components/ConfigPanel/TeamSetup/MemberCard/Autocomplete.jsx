import {
  Autocomplete as MuiAutocomplete,
  Avatar,
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@mui/material';

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
