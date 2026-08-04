import { useState } from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import { LoadingBar } from '@/components';
import { useElementColors, useSimulation } from '@/hooks';
import { formatStr } from '@/utils';
import TabPanels from './TabPanels';

const Charts = ({ team }) => {
  const results = useSimulation(team);
  const [tab, setTab] = useState(TabPanels[0].value);
  const color = useElementColors({ char: '$curr' });
  const handleTabs = (_, value) => setTab(value);

  if (!results.userSummary) return (
    <LoadingBar
      status={results.status}
      week={results.week}
      diff={results.diff}
    />
  );

  const activeTab = TabPanels.find((t) => t.value === tab);

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Tabs
        value={tab}
        onChange={handleTabs}
        textColor="inherit"
        slotProps={{
          indicator: {
            sx: {
              backgroundColor: color,
            },
          },
        }}
        centered
      >
        {TabPanels.map(({ value }) => (
          <Tab
            key={value}
            value={value}
            label={formatStr(value)}
          />
        ))}
      </Tabs>

      {activeTab?.render(results)}
    </Stack>
  );
};

export default Charts;
