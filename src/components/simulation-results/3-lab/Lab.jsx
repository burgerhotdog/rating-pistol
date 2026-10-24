import { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  FormControlLabel,
  IconButton,
  Menu,
  Skeleton,
  Stack,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Switch } from '@/components/Colored';
import { useAccent, useData } from '@/hooks';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';

const Lab = ({ results }) => {
  const langData = useData('lang');
  const [normalize, setNormalize] = useState(true);
  const [hideLimited, setHide5Star] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const accent = useAccent();

  const menuOpen = Boolean(anchorEl);

  const weaponsReady =
    results.userMember &&
    results.userDps &&
    results.weaponResults;

  const setsReady =
    results.userMember &&
    results.userDps &&
    results.setResults;

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader
            title={`${langData.Weapon} Comparisons`}
            action={
              <>
                <Tooltip title="Options">
                  <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={() => setAnchorEl(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Stack sx={{ px: 2, py: 0.5 }}>
                    <FormControlLabel
                      label="Normalize crit ratio & energy"
                      control={
                        <Switch
                          color={accent}
                          checked={normalize}
                          onChange={(event) => setNormalize(event.target.checked)}
                        />
                      }
                    />
                    <FormControlLabel
                      label="Hide other limited 5-Stars"
                      control={
                        <Switch
                          color={accent}
                          checked={hideLimited}
                          onChange={(event) => setHide5Star(event.target.checked)}
                        />
                      }
                    />
                  </Stack>
                </Menu>
              </>
            }
          />
          {weaponsReady ? (
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2 }}>
              <WeaponsDialog
                userMember={results.userMember}
                userDps={results.userDps}
                weaponResults={results.weaponResults}
                normalize={normalize}
                hideLimited={hideLimited}
              />
            </Box>
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>

        <Card component={Stack} sx={{ flex: 1 }}>
          <CardHeader title={`${langData.Equip} Set Comparisons`} />
          {setsReady ? (
            <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2 }}>
              <SetsDialog
                userMember={results.userMember}
                userDps={results.userDps}
                setResults={results.setResults}
              />
            </Box>
          ) : (
            <Skeleton variant="rectangular" sx={{ flex: 1 }} />
          )}
        </Card>
      </Stack>
    </Stack>
  );
};

export default Lab;