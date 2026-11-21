import { useState } from 'react';
import { Swords, Boxes, Astroid, Users } from 'lucide-react';
import {
  Box,
  Card,
  CardHeader,
  FormControlLabel,
  IconButton,
  Menu,
  Skeleton,
  Stack,
  Tab,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { Switch, Tabs } from '@/components/Colored';
import { useAccent } from '@/hooks';
import WeaponsDialog from './WeaponsDialog';
import SetsDialog from './SetsDialog';
import RankChart from './RankChart';

const Lab = ({ results }) => {
  const accent = useAccent();
  const [tab, setTab] = useState(0);

  const [normalize, setNormalize] = useState(true);
  const [hideLimited, setHideLimited] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  const weaponsReady =
    results.userMember &&
    results.userDps &&
    results.weaponResults;

  const setsReady =
    results.userMember &&
    results.userDps &&
    results.setResults;

  const rankChartReady =
    results.userMember &&
    results.userDps &&
    results.rankResults;

  return (
    <Card component={Stack} sx={{ flex: 1 }}>
      <CardHeader
        title="Comparisons"
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
                      onChange={(event) => setHideLimited(event.target.checked)}
                    />
                  }
                />
              </Stack>
            </Menu>
          </>
        }
      />

      <Stack direction="row">
        <Tabs
          color={accent}
          value={tab}
          onChange={(_, value) => setTab(value)}
          textColor="inherit"
          orientation="vertical"
        >
          <Tab value={0} title="Weapons" icon={<Swords size={24} />} />
          <Tab value={1} title="Sets" icon={<Boxes size={24} />} />
          <Tab value={2} title="Ranks" icon={<Astroid size={24} />} />
          <Tab value={3} title="Members" icon={<Users size={24} />} />
        </Tabs>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 2 }}>
          {tab === 0 && weaponsReady ? (
            <WeaponsDialog
              userMember={results.userMember}
              userDps={results.userDps}
              weaponResults={results.weaponResults}
              normalize={normalize}
              hideLimited={hideLimited}
            />
          ) : tab === 1 && setsReady ? (
            <SetsDialog
              userMember={results.userMember}
              userDps={results.userDps}
              setResults={results.setResults}
            />
          ) : tab === 2 && rankChartReady ? (
            <RankChart
              userMember={results.userMember}
              userDps={results.userDps}
              rankResults={results.rankResults}
            />
          ) : (
            <Skeleton variant="rectangular" />
          )}
        </Box>
      </Stack>
    </Card>
  );
};

export default Lab;