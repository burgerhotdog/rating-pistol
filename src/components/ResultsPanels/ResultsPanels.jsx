import { useState } from 'react';
import { LinearProgress, Stack, Tab, Typography } from '@mui/material';
import { useAccent, useSimulation } from '@/hooks';
import { Tabs } from '../Colored';
import OverviewTab from './OverviewTab';
import DamageProfileTab from './DamageProfileTab';
import BuildAnalysisTab from './BuildAnalysisTab';
import SkillLevelsAnalysisTab from './SkillLevelsAnalysisTab';

const LoadingBar = ({ results }) => {
  const { status, progressDay } = results;
  const accent = useAccent();

  return (
    <Stack direction="row" sx={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Stack spacing={1} sx={{ width: '50%' }}>
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
          {status ?? ''}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressDay ?? 0}
          sx={{
            visibility: status ? 'visible' : 'hidden',
            backgroundColor: 'action.hover',
            '& .MuiLinearProgress-bar': { backgroundColor: accent },
          }}
        />

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ visibility: progressDay ? 'visible' : 'hidden' }}
        >
          Day {progressDay}
        </Typography>
      </Stack>
    </Stack>
  );
};

const ResultsPanels = ({ team }) => {
  const accent = useAccent();
  const results = useSimulation(team);
  const [tab, setTab] = useState(0);

  if (results.errorLog) {
    console.log(results.errorLog);
    return;
  }

  if (!results.userSnapshots) {
    return <LoadingBar results={results} />;
  }

  return (
    <Stack spacing={1} sx={{ flex: 1 }}>
      <Tabs
        color={accent}
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="inherit"
        centered
      >
        <Tab value={0} label="Overview" />
        <Tab value={1} label="Build Analysis" />
        <Tab value={2} label="Skill Levels Analysis" />
        <Tab value={3} label="Damage Stats" />
      </Tabs>

      {tab === 0 && <OverviewTab results={results} />}
      {tab === 1 && <BuildAnalysisTab results={results} />}
      {tab === 2 && <SkillLevelsAnalysisTab results={results} />}
      {tab === 3 && <DamageProfileTab results={results} />}
    </Stack>
  );
};

export default ResultsPanels;
