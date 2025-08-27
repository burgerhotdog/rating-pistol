import { useState } from 'react';
import { Stack, Typography, Tabs, Tab } from '@mui/material';
import { INFO_DATA } from '@data';
import { getLetter, TabLabel } from '@utils';
import Info from './Info';
import Plot from './Plot';

const Rating = ({ gameId, modalPipe }) => {
  const { EQUIP_NAMES } = INFO_DATA[gameId];
  const { id, data, rating } = modalPipe;
  const [activeTab, setActiveTab] = useState(0);
  const benchmark = Math.round((rating.score / rating.scoreMax) * 100);
  const ratingData = rating.equips[activeTab];

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h6" color="primary">
          Overall Rating:
        </Typography>
        <Typography variant="h6">
          {benchmark.toFixed()}% ({getLetter(benchmark)})
        </Typography>
      </Stack>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
      >
        {EQUIP_NAMES.map((name, index) => (
          <Tab key={index} label={TabLabel(gameId, name, index)} />
        ))}
      </Tabs>

      <Stack direction="row" spacing={2}>
        <Info
          gameId={gameId}
          avatarId={id}
          index={activeTab}
          ratingData={ratingData}
          stat={data.equipList[activeTab].stat}
        />
        <Plot
          gameId={gameId}
          stat={data.equipList[activeTab].stat}
          index={activeTab}
          ratingData={ratingData}
        />
      </Stack>
    </Stack>
  );
};

export default Rating;
